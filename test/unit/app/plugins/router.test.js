describe('routes plugin test', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  test('routes included', async () => {
    const createServer = require('../../../../app/server')
    const server = await createServer()
    const routePaths = []
    server.table().forEach(element => {
      routePaths.push(element.path)
    })
    expect(routePaths).toEqual([
      '/accessibility', '/check-details', '/cookies', '/healthy', '/healthz', '/privacy-policy', '/signin-oidc', '/terms', '/update-details', '/vet-visits', '/view-all', '/', '/assets/{path*}', '/terms/v1', '/terms/v2', '/terms/v3', '/view-application/{reference}', '/check-details', '/cookies'
    ])
  })
})
