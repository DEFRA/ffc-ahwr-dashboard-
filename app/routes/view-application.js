const { Buffer } = require('buffer')
const Joi = require('joi')
const boom = require('@hapi/boom')
const { getApplication, getApplicationEvents } = require('../api/applications')
const { getStyleClassByStatus } = require('../constants/status')
const ViewModel = require('./models/view-application')
const { upperFirstLetter } = require('../lib/display-helper')
const applicationStatus = require('../constants/application-status')

module.exports = {
  method: 'GET',
  path: '/view-application/{reference}',
  options: {
    auth: false,
    validate: {
      params: Joi.object({
        reference: Joi.string().valid()
      }),
      query: Joi.object({
        errors: Joi.string().allow(null)
      })
    },
    handler: async (request, h) => {
      const application = await getApplication(request.params.reference)
      if (!application) {
        throw boom.badRequest()
      }

      let applicationEvents
      if ((application?.claimed ||
        application?.statusId === applicationStatus.inCheck ||
        application?.statusId === applicationStatus.readyToPay ||
        application?.statusId === applicationStatus.rejected) &&
        !application?.data?.dateOfClaim) {
        applicationEvents = await getApplicationEvents(application?.data?.organisation.sbi)
      }

      const status = upperFirstLetter(application.status.status.toLowerCase())
      const statusClass = getStyleClassByStatus(application.status.status)

      const errors = request.query.errors
        ? JSON.parse(Buffer.from(request.query.errors, 'base64').toString('utf8'))
        : []

      return h.view('view-application', {
        applicationId: application.reference,
        status,
        statusClass,
        organisationName: application?.data?.organisation?.name,
        vetVisit: application?.vetVisit,
        claimed: application?.claimed,
        payment: application?.payment,
        ...new ViewModel(application, applicationEvents),
        errors
      })
    }
  }
}
