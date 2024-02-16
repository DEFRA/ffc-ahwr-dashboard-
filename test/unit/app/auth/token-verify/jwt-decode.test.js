const jwt = require('jsonwebtoken')
const decodeJwt = require('../../../../../app/auth/token-verify/jwt-decode')

describe('decodeJwt function', () => {
  const mockToken = 'mock.jwt.token'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should decode a JWT token successfully', () => {
    // Mock jwt.decode to return a successful response
    const mockDecodedToken = { payload: 'decodedPayload' }
    jwt.decode = jest.fn().mockReturnValue({ payload: mockDecodedToken })

    const decodedToken = decodeJwt(mockToken)

    expect(jwt.decode).toHaveBeenCalledWith(mockToken, { complete: true })
    expect(decodedToken).toEqual(mockDecodedToken)
  })

  it('should return undefined and log an error if the token cannot be decoded', () => {
    // Mock jwt.decode to simulate failure to decode
    jwt.decode.mockReturnValue(null)

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const decodedToken = decodeJwt(mockToken)

    expect(jwt.decode).toHaveBeenCalledWith(mockToken, { complete: true })
    expect(decodedToken).toBeUndefined()
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Error while decoding JWT token:'))
    expect(errorSpy).toHaveBeenCalled()

    // Clean up
    logSpy.mockRestore()
    errorSpy.mockRestore()
  })
})
