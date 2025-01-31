const { http, HttpResponse } = require('msw')
const { setupServer } = require('msw/node')
const { applicationApi } = require('../../../../../app/config')
const { changeContactHistory } = require('../../../../../app/api-requests/contact-history-api')

const mswServer = setupServer()
mswServer.listen()

afterEach(() => {
  mswServer.resetHandlers()
})

afterAll(() => {
  mswServer.close()
})

test('changeContactHistory, throws returned errors', async () => {
  const logger = {
    setBindings: jest.fn()
  }

  const appService = http.put(
    `${applicationApi.uri}/application/contact-history`,
    () => new HttpResponse(null, {
      status: 400,
      statusText: 'Bad Request'
    })
  )

  mswServer.use(appService)

  const personSummary = {
    firstName: 'John',
    lastName: 'Testing'
  }

  const organisationSummary = {
    email: 'org.email@test.com',
    sbi: '987654321',
    address: {}
  }

  await expect(
    changeContactHistory(personSummary, organisationSummary, logger)
  ).rejects.toThrow('Response Error: 400 Bad Request')
})
