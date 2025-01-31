const { verify } = require('../../../../../app/auth/auth-code-grant/state')

const mockSession = require('../../../../../app/session/index')
jest.mock('../../../../../app/session/index')

describe('auth-code-grant state tests', () => {
  test('state verify - query error', () => {
    mockSession.getToken.mockResolvedValueOnce('access-token')

    const request = {
      query: { description: 'Error', error: true },
      yar: { id: 1 },
      logger: { setBindings: jest.fn() }
    }
    expect(verify(request)).toEqual(false)
  })

  test('state verify - no state', () => {
    mockSession.getToken.mockResolvedValueOnce('access-token')

    const request = {
      query: { description: 'No state', error: false, state: false },
      yar: { id: 1 },
      logger: { setBindings: jest.fn() }
    }
    expect(verify(request)).toEqual(false)
  })
})
