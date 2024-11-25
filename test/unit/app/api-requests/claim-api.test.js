const wreck = require('@hapi/wreck')

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
    wreck.get.mockResolvedValue(mockResponse)

    const claimServiceApi = require('../../../../app/api-requests/claim-api')
    const result = await claimServiceApi.getClaimsByApplicationReference(
      'applicationReference'
    )

    expect(result).toBe('payload')
  })

  test('return empty array when statusCode is 404', async () => {
    const mockResponse = {
      output: {
        statusCode: 404
      }
    }
    wreck.get.mockRejectedValue(mockResponse)

    const claimServiceApi = require('../../../../app/api-requests/claim-api')

    const payload = await claimServiceApi.getClaimsByApplicationReference('applicationReference')

    expect(payload).toEqual([])
    expect(claimServiceApi.isWithinLastTenMonths(Date.now())).toBe(true)
    expect(claimServiceApi.isWithinLastTenMonths()).toBe(false)
  })

  test('throws non 404 error responses', async () => {
    const mockResponse = {
      output: {
        statusCode: 500
      }
    }
    wreck.get.mockRejectedValue(mockResponse)

    const claimServiceApi = require('../../../../app/api-requests/claim-api')

    const logger = { setBindings: jest.fn() }
    expect(async () => {
      await claimServiceApi.getClaimsByApplicationReference('applicationReference', logger)
    }).rejects.toEqual(mockResponse)
  })
})
