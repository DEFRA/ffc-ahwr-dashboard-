// Import the actual HttpStatus for readability and to ensure consistency in your tests
const HttpStatus = require('http-status-codes')
const Wreck = require('@hapi/wreck')

// Mock the dependencies
jest.mock('@hapi/wreck', () => ({
  get: jest.fn()
}))

jest.mock('../../../../../app/config', () => ({
  ...jest.requireActual('../../../../../app/config'),
  authConfig: {
    ruralPaymentsAgency: {
      hostname: 'https://example.com'
    },
    defraId: {
      hostname: 'https://example.com',
      policy: 'policy123'
    }
  }
}))

// The actual test
describe('acquireSigningKey error scenario', () => {
  it('should return undefined and log an error when an error occurs', async () => {
    // Setup Wreck to simulate an error response
    Wreck.get.mockResolvedValue({
      res: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        statusMessage: 'Internal Server Error'
      },
      payload: null
    })

    // Import the module after mocking its dependencies
    const acquireSigningKey = require('../../../../../app/auth/token-verify/acquire-signing-key')

    // Spy on console.log and console.error to verify they were called
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const result = await acquireSigningKey()

    expect(result).toBeUndefined()
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Error while acquiring the signing key data:'))
    expect(errorSpy).toHaveBeenCalled()

    // Clean up
    logSpy.mockRestore()
    errorSpy.mockRestore()
  })
})

// Assuming @hapi/wreck and config are already mocked from the previous example
describe('acquireSigningKey success scenario', () => {
  it('should return the first signing key on successful acquisition', async () => {
    // Mock signing key data as expected from the successful response
    const mockSigningKeys = {
      keys: [
        { kid: 'key1', use: 'sig' /* other key properties */ }
        // Additional keys can be listed here if needed
      ]
    }

    // Setup Wreck to simulate a successful response
    Wreck.get.mockResolvedValue({
      res: {
        statusCode: HttpStatus.OK,
        statusMessage: 'OK'
      },
      payload: mockSigningKeys
    })

    // Import the module after mocking its dependencies
    const acquireSigningKey = require('../../../../../app/auth/token-verify/acquire-signing-key')

    const result = await acquireSigningKey()

    expect(result).toEqual(mockSigningKeys.keys[0])
  })
})
