const { http, HttpResponse } = require('msw')
const { setupServer } = require('msw/node')
const { authConfig } = require('../../../../../../app/config')
const { customerMustHaveAtLeastOneValidCph } = require('../../../../../../app/api-requests/rpa-api/cph-check')

const mswServer = setupServer()
mswServer.listen()

afterEach(() => {
  mswServer.resetHandlers()
})

afterAll(() => {
  mswServer.close()
})

test('cphCheck: throws if response.success is false', async () => {
  const { ruralPaymentsAgency } = authConfig

  const organisationId = '112233445'
  const state = {
    customer: {
      organisationId,
      crn: '1234567890'
    }
  }

  jest.replaceProperty(ruralPaymentsAgency, 'hostname', 'http://test.rpa')
  jest.replaceProperty(ruralPaymentsAgency, 'getCphNumbersUrl', '/cph/organisation/organisationId')
  const rpa = http.get(
    `http://test.rpa/cph/organisation/${organisationId}`,
    () => HttpResponse.json({
      success: false,
      errorString: 'test RPA failure'
    })
  )

  mswServer.use(rpa)

  const request = {
    yar: {
      get: jest.fn().mockReturnValueOnce(state.customer)
    }
  }

  await expect(customerMustHaveAtLeastOneValidCph(request, 'token'))
    .rejects.toThrow('test RPA failure')
})
