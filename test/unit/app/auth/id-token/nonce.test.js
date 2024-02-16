jest.mock('uuid', () => ({
  v4: jest.fn()
}))

jest.mock('../../../../../app/session', () => ({
  setToken: jest.fn(),
  getToken: jest.fn()
}))

const { generate, verify } = require('../../../../../app/auth/id-token/nonce')
const uuid = require('uuid')
const session = require('../../../../../app/session')
const sessionKeys = require('../../../../../app/session/keys')

describe('Nonce handling', () => {
  const mockNonce = 'uuid-nonce'
  const request = {} // Mock request object
  const idToken = { nonce: mockNonce } // Mock idToken object
  const logSpy = jest.spyOn(console, 'log')
  const logErrorSpy = jest.spyOn(console, 'error')

  beforeEach(() => {
    uuid.v4.mockReturnValue(mockNonce)
    session.setToken.mockClear()
    session.getToken.mockClear()
  })

  describe('generate', () => {
    test('should generate a nonce and store it in the session', () => {
      const nonce = generate(request)

      expect(uuid.v4).toHaveBeenCalled()
      expect(session.setToken).toHaveBeenCalledWith(request, sessionKeys.tokens.nonce, mockNonce)
      expect(nonce).toBe(mockNonce)
    })
  })

  describe('verify', () => {
    test('should throw an error if idToken is undefined', () => {
      expect(() => verify(request)).toThrow('Empty id_token')
    })

    test('should throw an error if session contains no nonce', () => {
      session.getToken.mockReturnValueOnce(null)
      expect(() => verify(request, idToken)).toThrow('HTTP Session contains no nonce')
    })

    test('should throw an error if nonce does not match', () => {
      session.getToken.mockReturnValueOnce('different-nonce')
      expect(() => verify(request, idToken)).toThrow('Nonce mismatch')
    })

    test('should not throw an error if nonce matches', () => {
      session.getToken.mockReturnValueOnce(mockNonce)
      expect(() => verify(request, idToken)).not.toThrow()
    })
    test('should log an error if idToken is undefined', () => {
      try {
        verify(request)
      } catch (error) {
        expect(logSpy).toBeCalled()
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Error while verifying id_token nonce: Empty id_token'))
        expect(console.error).toHaveBeenCalledWith(error)
      }
    })

    test('should log an error if session contains no nonce', () => {
      session.getToken.mockReturnValueOnce(null)

      try {
        verify(request, idToken)
      } catch (error) {
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Error while verifying id_token nonce: HTTP Session contains no nonce'))
        expect(logErrorSpy).toHaveBeenCalledWith(error)
      }
    })

    test('should log an error if nonce does not match', () => {
      session.getToken.mockReturnValueOnce('different-nonce')

      try {
        verify(request, idToken)
      } catch (error) {
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Error while verifying id_token nonce: Nonce mismatch'))
        expect(console.error).toHaveBeenCalledWith(error)
      }
    })

    test('logs successful verification', () => {
      session.getToken.mockReturnValueOnce(mockNonce)

      // This should not throw, but we should see a log for a successful verification
      verify(request, idToken)

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Verifying id_token nonce'))
    })
  })
})
