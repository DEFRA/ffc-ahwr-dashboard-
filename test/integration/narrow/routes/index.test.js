describe('Dashboard home page test', () => {
  test('GET / route returns 302 when NOT logged in and redirects to signin', async () => {
    const options = {
      method: 'GET',
      url: '/',
      auth: false
    }

    const res = await global.__SERVER__.inject(options)

    expect(res.statusCode).toBe(302)
    expect(res.headers.location.toString()).toEqual(expect.stringContaining('dcidmtest'))
  })

  test('GET / route returns 302 when logged in and redirects to /vet-visits', async () => {
    const options = {
      method: 'GET',
      url: '/',
      auth: {
        strategy: 'cookie',
        credentials: { reference: 'AHWR-2470-6BA9', sbi: '112670111' }
      }
    }

    const res = await global.__SERVER__.inject(options)

    expect(res.statusCode).toBe(302)
    expect(res.headers.location).toBe('/vet-visits')
  })
})
