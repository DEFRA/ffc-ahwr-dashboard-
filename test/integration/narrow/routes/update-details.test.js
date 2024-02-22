// Assume this is your route module being tested
const routeConfig = require('../../../../app/routes/update-details')

// Mock the Hapi response toolkit
const h = {
  view: jest.fn().mockReturnValue('view response')
}

describe('/update-details route', () => {
  test('has the correct method and path', () => {
    expect(routeConfig.method).toBe('GET')
    expect(routeConfig.path).toBe('/update-details')
  })

  test('does not require authentication', () => {
    expect(routeConfig.options.auth).toBeFalsy()
  })

  test('handler returns the correct view', async () => {
    // Call the handler directly with mocked request and response toolkit
    const response = await routeConfig.options.handler({}, h)

    // Check if the correct view is being returned
    expect(h.view).toHaveBeenCalledWith('update-details')
    expect(response).toBe('view response')
  })
})
