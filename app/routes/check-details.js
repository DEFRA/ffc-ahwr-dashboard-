const boom = require('@hapi/boom')
const { organisation: organisationKey, confirmCheckDetails } = require('../session/keys').farmerApplyData
const getOrganisation = require('./models/organisation')
const session = require('../session')
const Joi = require('joi')
const config = require('../config')

module.exports = [{
  method: 'GET',
  path: '/check-details',
  options: {
    handler: async (request, h) => {
      const organisation = session.getFarmerApplyData(request, organisationKey)
      if (!organisation) {
        return boom.notFound()
      }
      return h.view('check-details', getOrganisation(request, organisation))
    }
  }
},
{
  method: 'POST',
  path: '/check-details',
  options: {
    validate: {
      payload: Joi.object({
        [confirmCheckDetails]: Joi.string().valid('yes', 'no').required()
      }),
      failAction: (request, h, _err) => {
        const organisation = session.getFarmerApplyData(request, organisationKey)
        if (!organisation) {
          return boom.notFound()
        }
        return h.view('check-details', {
          errorMessage: { text: 'Select if your details are correct' },
          ...getOrganisation(request, organisation, 'Select if your details are correct')
        }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const answer = request.payload[confirmCheckDetails]
      if (answer === 'yes') {
        session.setFarmerApplyData(
          request,
          confirmCheckDetails,
          request.payload[confirmCheckDetails]
        )
        return h.redirect('/vet-visits')
      }
      return h.view('update-details', {
        ruralPaymentsAgency: config.ruralPaymentsAgency
      })
    }
  }
}]
