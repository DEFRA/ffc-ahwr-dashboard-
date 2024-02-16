const auth = require('../auth')
const session = require('../session')
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
      const { attachedToMultipleBusinesses } = session.getCustomer(request)
      const { organisation } = session.getEndemicsClaim(request)
      const application = (
        await getLatestApplicationsBySbi(organisation.sbi)
      ).find((app) => {
        return app.type === 'EE'
      })

      return h.view(vetVisits, {
        hasMultipleBusinesses: attachedToMultipleBusinesses,
        claimServiceRedirectUri: `${claimServiceRedirectUri}&sbi=${organisation.sbi}`,
        ...organisation,
        ...(application?.reference && { reference: application?.reference }),
        ...(attachedToMultipleBusinesses && { hostname: auth.requestAuthorizationCodeUrl(session, request) })
      })
    }
  }
}
