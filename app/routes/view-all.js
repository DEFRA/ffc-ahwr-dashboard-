const Joi = require('joi')
const { displayPageSize } = require('../pagination')
const viewTemplate = 'view-all'
const { ViewModel } = require('./models/application-list')
const crumbCache = require('./utils/crumb-cache')

module.exports = {
  method: 'GET',
  path: '/view-all',
  options: {
    auth: false,
    validate: {
      query: Joi.object({
        page: Joi.number().greater(0).default(1),
        limit: Joi.number().greater(0).default(displayPageSize)
      })
    },
    handler: async (request, h) => {
      await crumbCache.generateNewCrumb(request, h)
      return h.view(viewTemplate, await new ViewModel(request, '/view-all')) // NOSONAR
    }
  }
}
