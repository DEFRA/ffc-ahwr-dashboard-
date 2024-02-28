const auth = require('../auth')
const session = require('../session')
const { vetVisits, claimServiceUri } = require('../config/routes')
const { getLatestApplicationsBySbi } = require('../api-requests/application-api')
const { getClaimsByApplicationReference, isWithInLastTenMonths } = require('../api-requests/claim-api')
const { claimType } = require('../constants/claim')
const { statusId, statusClass } = require('../constants/status')

const pageUrl = `/${vetVisits}`
const claimServiceRedirectUri = `${claimServiceUri}/endemics?from=dashboard`

module.exports = {
  method: 'GET',
  path: pageUrl,
  options: {
    handler: async (request, h) => {
      const MAXIMUM_CLAIMS_TO_DISPLAY = 6
      const VETVISIT_APPLICATION_TYPE = 'VV'
      const { organisation } = session.getEndemicsClaim(request)
      const { attachedToMultipleBusinesses } = session.getCustomer(request)
      const applications = await getLatestApplicationsBySbi(organisation.sbi)
      const vetVisitApplications = applications?.filter((application) => application.type === 'VV')
      const latestEndemicsApplication = applications?.find((application) => application.type === 'EE')

      let claims = await getClaimsByApplicationReference(latestEndemicsApplication.reference) || []
      const vetVisitApplicationsWithInLastTenMonths = vetVisitApplications.filter((application) => isWithInLastTenMonths(application?.createdAt))

      const capitalize = (value) => value?.charAt(0).toUpperCase() + value?.slice(1)
      const sortByCreatedAt = (claims) => claims?.sort((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? a : b)
      const typeOfReviewTitle = (typeOfReview) => [claimType.review, VETVISIT_APPLICATION_TYPE].includes(typeOfReview) ? 'Health and welfare review' : 'Endemic disease follow-ups'
      const statusTag = (claim) => `<strong class=${statusClass[statusId[claim.statusId]]?.styleClass || 'govuk-tag--grey'}>${statusId[claim.statusId]}</strong>`
      const description = (claim) => `${claim.reference} - ${claim.data?.typeOfLivestock ? capitalize(claim.data?.typeOfLivestock) + ' - ' : ''} ${typeOfReviewTitle(claim.type)}`

      claims = [...(claims && sortByCreatedAt(claims)), ...(vetVisitApplicationsWithInLastTenMonths && sortByCreatedAt(vetVisitApplicationsWithInLastTenMonths))]
      claims = claims.slice(0, MAXIMUM_CLAIMS_TO_DISPLAY).map(claim => ([{ text: description(claim) }, { html: statusTag(claim) }]))

      return h.view(vetVisits, {
        claims,
        hasMultipleBusinesses: attachedToMultipleBusinesses,
        claimServiceRedirectUri: `${claimServiceRedirectUri}&sbi=${organisation.sbi}`,
        ...organisation,
        ...(latestEndemicsApplication?.reference && { reference: latestEndemicsApplication?.reference }),
        ...(attachedToMultipleBusinesses && { hostname: auth.requestAuthorizationCodeUrl(session, request) })
      })
    }
  }
}
