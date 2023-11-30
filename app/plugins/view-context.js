const { serviceName, claimServiceUri, serviceUri } = require('../config')

module.exports = {
  plugin: {
    name: 'view-context',
    register: (server, _) => {
      server.ext('onPreResponse', function (request, h) {
        const response = request.response

        if (response.variety === 'view') {
          const ctx = response.source.context || {}

          const { path } = request

          let serviceUrl = '/dashboard'

          if (path.startsWith('/dashboard/cookies')) {
            serviceUrl = '/dashboard/cookies'
          }
          ctx.serviceName = serviceName
          ctx.serviceUrl = serviceUrl
          ctx.claimServiceUri = claimServiceUri
          ctx.serviceUri = serviceUri

          response.source.context = ctx
        }

        return h.continue
      })
    }
  }
}
