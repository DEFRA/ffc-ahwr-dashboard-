const path = require('path')
const nunjucks = require('nunjucks')
const auth = require('../auth')
const session = require('../session')
const sessionKeys = require('../session/keys')
const { vetVisits, claimServiceUri } = require('../config/routes')
const { latestTermsAndConditionsUri, multiSpecies } = require('../config')
const { getLatestApplicationsBySbi } = require('../api-requests/application-api')
const { getClaimsByApplicationReference, isWithinLastTenMonths } = require('../api-requests/claim-api')
const applicationType = require('../constants/application-type')
const { claimType } = require('../constants/claim')
const { userNeedsNotification } = require('./utils/user-needs-notification')

const pageUrl = `/${vetVisits}`
const claimServiceRedirectUri = `${claimServiceUri}/endemics?from=dashboard`

module.exports = {
  method: 'GET',
  path: pageUrl,
  options: {
    handler: async (request, h) => {
      const { organisation } = session.getEndemicsClaim(request)

      request.logger.setBindings({ sbi: organisation.sbi })

      const { attachedToMultipleBusinesses } = session.getCustomer(request)
      const applications = await getLatestApplicationsBySbi(organisation.sbi, request.logger)

      const vetVisitApplications = applications?.filter((application) => application.type === applicationType.VET_VISITS)
      const latestEndemicsApplication = applications?.find((application) => application.type === applicationType.ENDEMICS)

      const claims = latestEndemicsApplication ? await getClaimsByApplicationReference(latestEndemicsApplication?.reference, request.logger) : []
      const vetVisitApplicationsWithinLastTenMonths = vetVisitApplications.filter((application) => isWithinLastTenMonths(application?.data?.visitDate))
      const allClaims = [...claims, ...vetVisitApplicationsWithinLastTenMonths]

      const env = nunjucks.configure([
        path.join(__dirname, '../views/snippets'),
        'node_modules/govuk-frontend/dist'
      ])

      const claimsRows = allClaims
        .map(claim => {
          const newClaimVisitDate = claim.data.dateOfVisit
          const oldClaimVisitDate = claim.data.visitDate
          const dateOfVisit = new Date(newClaimVisitDate || oldClaimVisitDate)
          const formattedDateOfVisit = dateOfVisit
            .toLocaleString('en-gb', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })

          return [
            {
              text: formattedDateOfVisit,
              attributes: {
                'data-sort-value': dateOfVisit.getTime()
              }
            },
            { text: env.render('species.njk', { species: claim.data.typeOfLivestock ?? claim.data.whichReview }) },
            { text: env.render('claim-type.njk', { claimType: claim.data.claimType ?? claimType.review }) },
            { text: claim.reference },
            { html: env.render('tag.njk', { status: claim.statusId }) }
          ]
        })

      session.setEndemicsClaim(request, sessionKeys.endemicsClaim.LatestEndemicsApplicationReference, latestEndemicsApplication?.reference)
      const downloadedDocument = `/download-application/${organisation.sbi}/${latestEndemicsApplication?.reference}`

      const showNotificationBanner =
        multiSpecies.enabled &&
        Boolean(latestEndemicsApplication) &&
        userNeedsNotification(applications, claims)

      return h.view(vetVisits, {
        claimsRows,
        showNotificationBanner,
        attachedToMultipleBusinesses,
        claimServiceRedirectUri: `${claimServiceRedirectUri}&sbi=${organisation.sbi}`,
        ...organisation,
        ...(latestEndemicsApplication?.reference && { reference: latestEndemicsApplication?.reference }),
        ...(latestEndemicsApplication?.reference && { downloadedDocument }),
        ...(attachedToMultipleBusinesses && { hostname: auth.requestAuthorizationCodeUrl(session, request) }),
        latestTermsAndConditionsUri
      })
    }
  }
}
