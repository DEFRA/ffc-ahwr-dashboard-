const mockSession = require('../../../../../app/session/index')
const wreck = require('@hapi/wreck')
const base = require('../../../../../app/api-requests/rpa-api/base')
const mockJwtDecode = require('../../../../../app/auth/token-verify/jwt-decode')
jest.mock('../../../../../app/session/index')
jest.mock('@hapi/wreck')
jest.mock('../../../../../app/auth/token-verify/jwt-decode')
const HttpStatus = require('http-status-codes')

describe('Base', () => {
  test('when get called - returns valid payload', async () => {
    const hostname = 'https://testhost'
    const url = '/get/test'
    const contactName = 'Mr Smith'
    const accessToken = 'access_token'
    const apimOcpSubscriptionKey = 'apim-ocp-subscription-key'
    const contactId = 1234567
    const wreckResponse = {
      payload: {
        name: contactName,
        id: contactId
      },
      res: {
        statusCode: HttpStatus.StatusCodes.OK
      }
    }

    const headers = {}
    headers['X-Forwarded-Authorization'] = accessToken
    headers['Ocp-Apim-Subscription-Key'] = apimOcpSubscriptionKey

    const options = {
      headers,
      json: true,
      rejectUnauthorized: false,
      timeout: 10000
    }
    wreck.get = jest.fn().mockResolvedValueOnce(wreckResponse)

    mockSession.getToken.mockResolvedValueOnce(accessToken)
    mockJwtDecode.mockResolvedValue(contactId)

    const request = { logger: { setBindings: jest.fn() } }
    const result = await base.get(hostname, url, request, headers)

    expect(result).toEqual(wreckResponse.payload)
    expect(wreck.get).toHaveBeenCalledTimes(1)
    expect(wreck.get).toHaveBeenCalledWith(`${hostname}${url}`, options)
  })

  test('when called and error occurs, throwns error', async () => {
    const hostname = 'https://testhost'
    const url = '/get/test'
    const contactId = 1234567
    const accessToken = 'access_token'
    const error = new Error('Test error in base')

    wreck.get = jest.fn().mockRejectedValueOnce(error)

    mockSession.getToken.mockResolvedValueOnce(accessToken)
    mockJwtDecode.mockResolvedValue(contactId)

    const request = { logger: { setBindings: jest.fn() } }
    expect(async () =>
      await base.get(hostname, url, request)
    ).rejects.toThrowError(error)
  })
})
