const createServer = require('../../../../app/server')

test('get /healthz', async () => {
  const server = await createServer()
  const res = await server.inject({
    url: '/healthz'
  })

  expect(res.statusCode).toBe(200)
})
