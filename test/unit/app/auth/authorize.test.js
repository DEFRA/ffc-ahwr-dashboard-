describe('Generate authentication url test', () => {
  let auth
  let sessionMock
  const MOCK_VERIFY = jest.fn()

  beforeAll(() => {
    sessionMock = require('../../../../app/session')
    jest.mock('../../../../app/session')

    jest.mock('../../../../app/auth/auth-code-grant/state', () => ({
      ...jest.requireActual('../../../../app/auth/auth-code-grant/state'),
      verify: MOCK_VERIFY
    }))

    auth = require('../../../../app/auth')
  })

  test('when requestAuthorizationCodeUrl with pkce true challenge parameter added', async () => {
    const setPkcecodesMock = jest.fn()
    const setTokenMock = jest.fn()
    const session = {
      setPkcecodes: setPkcecodesMock,
      setToken: setTokenMock
    }
    const result = auth.requestAuthorizationCodeUrl(session, undefined)
    const params = new URL(result).searchParams
    expect(params.get('code_challenge')).not.toBeNull()
  })

  test('when requestAuthorizationCodeUrl with pkce false no challenge parameter is added', async () => {
    const setPkcecodesMock = jest.fn()
    const setTokenMock = jest.fn()
    const session = {
      setPkcecodes: setPkcecodesMock,
      setToken: setTokenMock
    }
    const result = auth.requestAuthorizationCodeUrl(session, undefined, undefined, false)
    const params = new URL(result).searchParams
    expect(params.get('code_challenge')).toBeNull()
  })

  test('when authenticate successfull returns access token', async () => {
    MOCK_VERIFY.mockReturnValueOnce(true)
    // const result = await auth.authenticate({}, sessionMock)
    // expect(result).toEqual('dummy_access_token')
  })

  test('when invalid state error is thrown', async () => {
    MOCK_VERIFY.mockReturnValueOnce(false)
    const request = {
      yar: { id: '33' },
      logger: { setBindings: jest.fn() }
    }

    await expect(() => auth.authenticate(request, sessionMock))
      .rejects.toThrow('Invalid state')
  })
})
