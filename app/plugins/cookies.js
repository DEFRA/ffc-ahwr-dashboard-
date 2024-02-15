const { cookie: { cookieNameCookiePolicy }, cookiePolicy } = require('../config')
const { getCurrentPolicy } = require('../cookies')
const HttpStatus = require('http-status-codes')


module.exports = {
  plugin: {
    name: 'cookies',
    register: (server, _) => {
      server.state(cookieNameCookiePolicy, cookiePolicy)

      server.ext('onPreResponse', (request, h) => {
        const statusCode = request.response.statusCode
        if (
          request.response.variety === 'view' &&
          statusCode !== HttpStatus.StatusCodes.NOT_FOUND &&
          statusCode !== HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR &&
          request.response.source.manager._context
        ) {
          const cookiesPolicy = getCurrentPolicy(request, h)
          request.response.source.manager._context.cookiesPolicy =
            cookiesPolicy
        }
        return h.continue
      })
    }
  }
}
