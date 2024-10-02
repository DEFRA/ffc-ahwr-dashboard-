const session = require('../../../../app/session')
const { getBlob } = require('../../../../app/storage')

jest.mock('../../../../app/storage')
jest.mock('../../../../app/session')
jest.mock('../../../../app/config', () => ({
  ...jest.requireActual('../../../../app/config'),
  authConfig: {
    defraId: {
      hostname: 'https://tenant.b2clogin.com/tenant.onmicrosoft.com',
      oAuthAuthorisePath: '/oauth2/v2.0/authorize',
      policy: 'b2c_1a_signupsigninsfi',
      redirectUri: 'http://localhost:3003/signin-oidc',
      clientId: 'dummy_client_id',
      serviceId: 'dummy_service_id',
      scope: 'openid dummy_client_id offline_access'
    },
    ruralPaymentsAgency: {
      hostname: 'dummy-host-name',
      getPersonSummaryUrl: 'dummy-get-person-summary-url',
      getOrganisationPermissionsUrl: 'dummy-get-organisation-permissions-url',
      getOrganisationUrl: 'dummy-get-organisation-url'
    }
  },
  endemics: {
    enabled: true
  }
}))
jest.mock('../../../../app/auth')

describe('Download Application Route', () => {
  const auth = {
    credentials: { reference: '1111', sbi: '111111111' },
    strategy: 'cookie'
  }
  beforeEach(() => {
    session.getEndemicsClaim.mockReturnValue({
      LatestEndemicsApplicationReference: 'TEST-REF-001',
      organisation: { sbi: '123456789' }
    })
  })

  test('returns PDF when SBI and reference match', async () => {
    const mockPdfBuffer = Buffer.from('mock pdf content')
    getBlob.mockReturnValue(mockPdfBuffer)
    const options = {
      auth,
      method: 'GET',
      url: '/download-application/123456789/TEST-REF-001'
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toBe('application/pdf')
    expect(getBlob).toHaveBeenCalled()
    jest.resetAllMocks()
  })

  test('returns 404 when reference does not match', async () => {
    const options = {
      auth,
      method: 'GET',
      url: '/download-application/123456789/TEST-REF-002'
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(404)
    expect(getBlob).not.toHaveBeenCalled()
  })

  test('returns 404 when SBI does not match', async () => {
    const options = {
      auth,
      method: 'GET',
      url: '/download-application/123456786/TEST-REF-001'
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(404)
    expect(getBlob).not.toHaveBeenCalled()
  })
})
