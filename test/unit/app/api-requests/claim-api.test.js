const Wreck = require('@hapi/wreck')
const consoleErrorSpy = jest.spyOn(console, 'error')

jest.mock('applicationinsights', () => ({
  defaultClient: { trackException: jest.fn(), trackEvent: jest.fn() },
  dispose: jest.fn()
}))
jest.mock('@hapi/wreck')

describe('Claim Service API', () => {
  test('Get claims by application reference should return status 200', async () => {
    const mockResponse = {
      res: {
        statusCode: 200,
        statusMessage: 'OK'
      },
      payload: 'payload'
    }
    Wreck.get.mockResolvedValue(mockResponse)

    const claimServiceApi = require('../../../../app/api-requests/claim-api')
    const result = await claimServiceApi.getClaimsByApplicationReference(
      'applicationReference'
    )

    expect(result).toBe('payload')
  })
  test('Get claims by application reference should return null with status 404', async () => {
    const mockResponse = {
      res: {
        statusCode: 404,
        statusMessage: 'not found'
      },
      payload: 'payload'
    }
    Wreck.get.mockResolvedValue(mockResponse)

    const claimServiceApi = require('../../../../app/api-requests/claim-api')
    const result = await claimServiceApi.getClaimsByApplicationReference(
      'applicationReference'
    )

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
    expect(result).toBe(null)
    expect(claimServiceApi.isWithinLastTenMonths(Date.now())).toBe(true)
    expect(claimServiceApi.isWithinLastTenMonths()).toBe(false)
  })
})
