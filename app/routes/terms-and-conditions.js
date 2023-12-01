const { serviceUri } = require('../config/index')

module.exports = [
  {
    method: 'GET',
    path: '/terms',
    options: {
      auth: false,
      handler: async (request, h) => {
        return h.view('terms-and-conditions/private-beta-2', { continueUri: `${serviceUri}/declaration`, showContinueButton: request.query?.continue === 'true' })
      }
    }
  },
  {
    method: 'GET',
    path: '/terms/v1',
    options: {
      auth: false,
      handler: async (request, h) => {
        return h.view('terms-and-conditions/private-beta-1', { continueUri: `${serviceUri}/declaration`, showContinueButton: request.query?.continue === 'true' })
      }
    }
  },
  {
    method: 'GET',
    path: '/terms/v2',
    options: {
      auth: false,
      handler: async (request, h) => {
        return h.view('terms-and-conditions/private-beta-2', { continueUri: `${serviceUri}/declaration`, showContinueButton: request.query?.continue === 'true' })
      }
    }
  },
  {
    method: 'GET',
    path: '/terms/v3',
    options: {
      auth: false,
      handler: async (request, h) => {
        return h.view('terms-and-conditions/private-beta-3', { backLink: request.query?.backLink, continueUri: `${serviceUri}/declaration`, showContinueButton: request.query?.continue === 'true' })
      }
    }
  }
]
