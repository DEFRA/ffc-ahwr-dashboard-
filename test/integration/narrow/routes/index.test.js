const HttpStatus = require('http-status-codes')
describe('Dashboard home page test', () => {
  beforeAll(async () => {
    jest.mock('../../../../app/config', () => ({
      ...jest.requireActual('../../../../app/config'),
      endemics: {
        enabled: true
      }
    }))
  })

  test('GET / route returns HttpStatus.StatusCodes.MOVED_TEMPORARILY when NOT logged in and redirects to signin', async () => {
    const options = {
      method: 'GET',
      url: '/',
      auth: false
    }

    const res = await global.__SERVER__.inject(options)

    expect(res.statusCode).toBe(HttpStatus.StatusCodes.MOVED_TEMPORARILY)
  })

  test('GET / route returns HttpStatus.StatusCodes.MOVED_TEMPORARILY when logged in and redirects to /vet-visits', async () => {
    const options = {
      method: 'GET',
      url: '/',
      auth: {
        strategy: 'cookie',
        credentials: { reference: 'AHWR-2470-6BA9', sbi: '112670111' }
      }
    }

    const res = await global.__SERVER__.inject(options)

    expect(res.statusCode).toBe(HttpStatus.StatusCodes.MOVED_TEMPORARILY)
    expect(res.headers.location).toBe('/vet-visits')
  })
})
