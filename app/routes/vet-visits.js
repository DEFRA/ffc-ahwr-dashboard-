const { getFarmerApplyData } = require('../session')
const { vetVisits } = require('../config/routes')
const {
  getLatestApplicationsBySbi
} = require('../api-requests/application-api')

const pageUrl = `/${vetVisits}`

module.exports = {
  method: 'GET',
  path: pageUrl,
  options: {
    auth: false,
    handler: async (request, h) => {
      const { organisation } = getFarmerApplyData(request)
      const application = (
        await getLatestApplicationsBySbi(organisation.sbi)
      ).find((application) => {
        return application.type === 'EE'
      })

      return h.view('vet-visits', {
        ...organisation,
        ...(application.reference && { reference: application.reference })
      })
    }
  }
}
