const { getEndemicsClaim } = require('../session')
const { vetVisits, claimServiceUri } = require('../config/routes')
const {
  getLatestApplicationsBySbi
} = require('../api-requests/application-api')

const pageUrl = `/${vetVisits}`
const claimServiceRedirectUri = `${claimServiceUri}/endemics?from=dashboard`

module.exports = {
  method: 'GET',
  path: pageUrl,
  options: {
    handler: async (request, h) => {
      const { organisation } = getEndemicsClaim(request)
      const application = (
        await getLatestApplicationsBySbi(organisation.sbi)
      ).find((application) => {
        return application.type === 'EE'
      })

      return h.view(vetVisits, {
        claimServiceRedirectUri: `${claimServiceUri}/endemics/which-review-annual`,
        ...organisation,
        ...(application?.reference && { reference: application?.reference })
      })
    }
  }
}
