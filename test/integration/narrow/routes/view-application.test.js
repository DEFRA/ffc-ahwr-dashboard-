const cheerio = require('cheerio')
const applications = require('../../../../app/api/applications')
const { resetAllWhenMocks } = require('jest-when')

jest.mock('../../../../app/api/applications')

describe('View Application test', () => {
  const url = '/view-application'

  beforeAll(() => {
    jest.clearAllMocks()

    jest.mock('../../../../app/config', () => ({
      ...jest.requireActual('../../../../app/config'),
      dateOfTesting: {
        enabled: false
      }
    }))
  })

  afterEach(() => {
    resetAllWhenMocks()
  })

  describe(`GET ${url} route`, () => {
    test('returns 404', async () => {
      applications.getApplication.mockReturnValueOnce(null)
      const options = {
        method: 'GET',
        url,
        auth: false
      }
      const res = await global.__SERVER__.inject(options)
      expect(res.statusCode).toBe(404)
      const $ = cheerio.load(res.payload)
      expect($('h1.govuk-heading-l').text()).toEqual('404 - Not Found')
    })
  })
})
