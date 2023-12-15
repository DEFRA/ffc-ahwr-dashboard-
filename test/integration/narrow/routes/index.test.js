const cheerio = require('cheerio')
const expectPhaseBanner = require('../../../utils/phase-banner-expect')

describe('Dashboard home page test', () => {
  test('GET / route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/'
    }

    const res = await global.__SERVER__.inject(options)

    expect(res.statusCode).toBe(200)
    const $ = cheerio.load(res.payload)
    expectPhaseBanner.ok($)
  })
})
