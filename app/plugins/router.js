const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/assets'),
  require('../routes/cookies'),
  require('../routes/index'),
  require('../routes/check-details'),
  require('../routes/update-details'),
  require('../routes/signin-oidc'),
  require('../routes/vet-visits'),
  require('../routes/download-application')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, _) => {
      server.route(routes)
    }
  }
}
