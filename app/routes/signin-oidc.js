const Joi = require('joi')
const crumbCache = require('./utils/crumb-cache')
const session = require('../session')
const auth = require('../auth')
const sessionKeys = require('../session/keys')
const config = require('../config')
const { getPersonSummary, getPersonName, organisationIsEligible, getOrganisationAddress, cphCheck } = require('../api-requests/rpa-api')
const applicationApi = require('../api-requests/application-api')
const { farmerApply } = require('../constants/user-types')
const { closedStatuses } = require('../constants/status')
const applicationType = require('../constants/application-type')
const loginSources = require('../constants/login-sources')
const { InvalidPermissionsError, NoEndemicsAgreementError, NoEligibleCphError, InvalidStateError, OutstandingAgreementError, LockedBusinessError } = require('../exceptions')
const { raiseIneligibilityEvent } = require('../event')
const appInsights = require('applicationinsights')
const HttpStatus = require('http-status-codes')

function setOrganisationSessionData (request, personSummary, org) {
  const organisation = {
    sbi: org.sbi?.toString(),
    farmerName: getPersonName(personSummary),
    name: org.name,
    email: personSummary.email ? personSummary.email : org.email,
    address: getOrganisationAddress(org.address)
  }

  // todo: only use one of these, but currently apply uses one and journey uses the other
  session.setEndemicsClaim(
    request,
    sessionKeys.endemicsClaim.organisation,
    organisation
  )

  session.setFarmerApplyData(
    request,
    sessionKeys.farmerApplyData.organisation,
    organisation
  )
}

module.exports = [{
  method: 'GET',
  path: '/signin-oidc',
  options: {
    auth: false,
    validate: {
      query: Joi.object({
        code: Joi.string().required(),
        state: Joi.string().required()
      }).options({
        stripUnknown: true
      }),
      failAction (request, h, err) {
        console.log(`Validation error caught during DEFRA ID redirect - ${err.message}.`)
        appInsights.defaultClient.trackException({ exception: err })
        return h.view('verify-login-failed', {
          backLink: auth.requestAuthorizationCodeUrl(session, request),
          ruralPaymentsAgency: config.ruralPaymentsAgency
        }).code(HttpStatus.StatusCodes.BAD_REQUEST).takeover()
      }
    },
    handler: async (request, h) => {
      try {
        await crumbCache.generateNewCrumb(request, h)
        const loginSource = JSON.parse(Buffer.from(request.query.state, 'base64').toString('ascii')).source

        await auth.authenticate(request, session)
        const apimAccessToken = await auth.retrieveApimAccessToken()
        const personSummary = await getPersonSummary(request, apimAccessToken)
        session.setCustomer(request, sessionKeys.customer.id, personSummary.id)
        const { organisation, organisationPermission } = await organisationIsEligible(request, personSummary.id, apimAccessToken)
        setOrganisationSessionData(request, personSummary, organisation)

        auth.setAuthCookie(request, personSummary.email, farmerApply)
        appInsights.defaultClient.trackEvent({
          name: 'login',
          properties: {
            sbi: organisation.sbi,
            crn: session.getCustomer(request, sessionKeys.customer.crn),
            email: personSummary.email
          }
        })

        if (organisation.locked) {
          throw new LockedBusinessError(`Organisation id ${organisation.id} is locked by RPA`)
        }

        if (!organisationPermission) {
          throw new InvalidPermissionsError(`Person id ${personSummary.id} does not have the required permissions for organisation id ${organisation.id}`)
        }

        await cphCheck.customerMustHaveAtLeastOneValidCph(request, apimAccessToken)

        const endemicsApplyJourney = `${config.applyServiceUri}/endemics/check-details`
        const oldClaimJourney = `${config.claimServiceUri}/check-details`

        const latestApplicationsForSbi = await applicationApi.getLatestApplicationsBySbi(organisation.sbi)

        if (latestApplicationsForSbi.length === 0) {
          if (loginSource === loginSources.apply) {
            // send to endemics apply journey
            return h.redirect(endemicsApplyJourney)
          } else {
            // show the 'You need to complete an endemics application' error page
            throw new NoEndemicsAgreementError(`Business with SBI ${organisation.sbi} must complete an endemics agreement`)
          }
        }

        const latestApplication = latestApplicationsForSbi[0]
        if (latestApplication.type === applicationType.ENDEMICS) {
          return h.redirect('/check-details')
        }

        if (closedStatuses.includes(latestApplication.statusId)) {
          if (loginSource === loginSources.apply) {
            // send to endemics apply journey
            return h.redirect(endemicsApplyJourney)
          } else {
            // show the 'You need to complete an endemics application' error page
            throw new NoEndemicsAgreementError(`Business with SBI ${organisation.sbi} must complete an endemics agreement`)
          }
        }

        // they have an open old world application/claim
        if (loginSource === loginSources.apply) {
          // show the 'You have an outstanding claim' error page
          throw new OutstandingAgreementError(`Business with SBI ${organisation.sbi} must claim or withdraw agreement before creating another`)
        } else {
          // send to old claim journey
          return h.redirect(oldClaimJourney)
        }
      } catch (err) {
        console.error(`Received error with name ${err.name} and message ${err.message}.`)
        const attachedToMultipleBusinesses = session.getCustomer(request, sessionKeys.customer.attachedToMultipleBusinesses)
        const organisation = session.getEndemicsClaim(request, sessionKeys.endemicsClaim.organisation)
        const crn = session.getCustomer(request, sessionKeys.customer.crn)

        switch (true) {
          case err instanceof InvalidStateError:
            return h.redirect(auth.requestAuthorizationCodeUrl(session, request))
          case err instanceof InvalidPermissionsError:
            break
          case err instanceof LockedBusinessError:
            break
          case err instanceof NoEligibleCphError:
            break
          case err instanceof OutstandingAgreementError:
            break
          case err instanceof NoEndemicsAgreementError:
            break
          default:
            appInsights.defaultClient.trackException({ exception: err })
            return h.view('verify-login-failed', {
              backLink: auth.requestAuthorizationCodeUrl(session, request),
              ruralPaymentsAgency: config.ruralPaymentsAgency
            }).code(HttpStatus.StatusCodes.BAD_REQUEST).takeover()
        }

        raiseIneligibilityEvent(
          request.yar.id,
          organisation?.sbi,
          crn,
          organisation?.email,
          err.name
        )

        return h.view('cannot-apply-exception', {
          ruralPaymentsAgency: config.ruralPaymentsAgency,
          permissionError: err instanceof InvalidPermissionsError,
          cphError: err instanceof NoEligibleCphError,
          lockedBusinessError: err instanceof LockedBusinessError,
          outstandingAgreementError: err instanceof OutstandingAgreementError,
          noEndemicsAgreementError: err instanceof NoEndemicsAgreementError,
          hasMultipleBusinesses: attachedToMultipleBusinesses,
          backLink: auth.requestAuthorizationCodeUrl(session, request),
          claimLink: `${config.claimServiceUri}/endemics/`,
          applyLink: `${config.applyServiceUri}/endemics/start`,
          sbiText: ` - SBI ${organisation?.sbi ?? ''}`,
          organisationName: organisation?.name,
          guidanceLink: config.serviceUri
        }).code(HttpStatus.StatusCodes.BAD_REQUEST).takeover()
      }
    }
  }
}
]
