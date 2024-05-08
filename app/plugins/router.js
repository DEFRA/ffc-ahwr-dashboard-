const config = require('../config')

let routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz')
)

if (config.endemics.enabled) {
  routes = routes.concat(
    require('../routes/assets'),
    require('../routes/cookies'),
    require('../routes/index'),
    require('../routes/check-details'),
    require('../routes/update-details'),
    require('../routes/signin-oidc'),
    require('../routes/vet-visits')
  )
}

module.exports = {
  plugin: {
    name: 'router',
    register: (server, _) => {
      server.route(routes)
    }
  }
}
