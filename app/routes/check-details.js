const HttpStatus = require('http-status-codes')
const Joi = require('joi')
const boom = require('@hapi/boom')
const session = require('../session')
const config = require('../config')
const auth = require('../auth')
const { organisation: organisationKey, confirmCheckDetails } = require('../session/keys').endemicsClaim
const getOrganisation = require('./models/organisation')

module.exports = [{
  method: 'GET',
  path: '/check-details',
  options: {
    handler: async (request, h) => {
      const organisation = session.getEndemicsClaim(request, organisationKey)
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
        const organisation = session.getEndemicsClaim(request, organisationKey)
        if (!organisation) {
          return boom.notFound()
        }
        return h.view('check-details', {
          errorMessage: { text: 'Select if your details are correct' },
          ...getOrganisation(request, organisation, 'Select if your details are correct')
        }).code(HttpStatus.StatusCodes.BAD_REQUEST).takeover()
      }
    },
    handler: async (request, h) => {
      const answer = request.payload[confirmCheckDetails]
      if (answer === 'yes') {
        session.setEndemicsClaim(
          request,
          confirmCheckDetails,
          request.payload[confirmCheckDetails]
        )
        return h.redirect('/vet-visits')
      }
      return h.view('update-details', {
        ruralPaymentsAgency: config.ruralPaymentsAgency,
        backLink: {
          href: auth.requestAuthorizationCodeUrl(session, request)
        }
      })
    }
  }
}]
