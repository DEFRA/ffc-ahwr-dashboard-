const { getEndemicsClaim } = require('../session')
const { vetVisits } = require('../config/routes')
const {
  getLatestApplicationsBySbi
} = require('../api-requests/application-api')

const pageUrl = `/${vetVisits}`

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
        ...organisation,
        ...(application?.reference && { reference: application?.reference })
      })
    }
  }
}
