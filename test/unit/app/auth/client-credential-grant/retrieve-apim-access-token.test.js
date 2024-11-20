const retrieveApimAccessToken = require('../../../../../app/auth/client-credential-grant/retrieve-apim-access-token')
const wreck = require('@hapi/wreck')
jest.mock('@hapi/wreck')
const HttpStatus = require('http-status-codes')

describe('Retrieve apim access token', () => {
  test('when retrieveApimAccessToken called - returns valid access token', async () => {
    const tokenType = 'Bearer'
    const token = 'access-token'
    const wreckResponse = {
      payload: {
        token_type: tokenType,
        access_token: token
      },
      res: {
        statusCode: HttpStatus.StatusCodes.OK
      }
    }

    wreck.post = jest.fn().mockResolvedValueOnce(wreckResponse)

    const request = { logger: { setBindings: jest.fn() } }
    const result = await retrieveApimAccessToken(request)

    expect(result).toMatch(`${tokenType} ${token}`)
  })

  test('when retrieveApimAccessToken called - error thrown when not HttpStatus.StatusCodes.OK status code', async () => {
    const wreckResponse = {
      res: {
        statusCode: 404,
        statusMessage: 'Call failed'
      }
    }

    wreck.post = jest.fn().mockRejectedValueOnce(wreckResponse)

    const request = { logger: { setBindings: jest.fn() } }
    expect(async () =>
      await retrieveApimAccessToken(request)
    ).rejects.toEqual(wreckResponse)
  })
})
