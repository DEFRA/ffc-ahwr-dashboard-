const createServer = require('../../../../app/server')

test('get /healthy', async () => {
  const server = await createServer()
  const res = await server.inject({
    url: '/healthy'
  })

  expect(res.statusCode).toBe(200)
})
