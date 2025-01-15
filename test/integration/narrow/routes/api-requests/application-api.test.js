const { http, HttpResponse } = require('msw')
const { setupServer } = require('msw/node')
const { applicationApi } = require('../../../../../app/config')
const { getLatestApplicationsBySbi } = require('../../../../../app/api-requests/application-api')

const mswServer = setupServer()
mswServer.listen()

afterEach(() => {
  mswServer.resetHandlers()
})

afterAll(() => {
  mswServer.close()
})

test('getLatestApplicationsBySbi: throws returned errors', async () => {
  const logger = {
    setBindings: jest.fn()
  }

  const appService = http.get(
    `${applicationApi.uri}/applications/latest`,
    () => new HttpResponse(null, {
      status: 400,
      statusText: 'Bad Request'
    })
  )

  mswServer.use(appService)

  await expect(getLatestApplicationsBySbi('101010101', logger))
    .rejects.toThrow('Response Error: 400 Bad Request')
})
