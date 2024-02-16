const HttpStatus = require('http-status-codes')
describe('Healthy test', () => {
  test('GET /healthy route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/healthy'
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(HttpStatus.StatusCodes.OK)
  })
})
