import { getConfig } from '../../../../app/config/index.js'

describe('Auth config', () => {
  const env = process.env

  beforeEach(() => {
    process.env = { ...env }
  })

  afterEach(() => {
    process.env = env
  })

  test('defaults used for missing values where applicable', () => {
    delete process.env.REDIS_PORT
    delete process.env.PORT

    const config = getConfig()

    expect(config.cache.options.port).toBe(6379)
    expect(config.port).toBe(3000)
  })

  test('environment variables used for overriding values', () => {
    process.env.DISPLAY_PAGE_SIZE = '100'
    process.env.MULTI_SPECIES_ENABLED = 'true'

    const config = getConfig()

    expect(config.displayPageSize).toBe(100)
    expect(config.multiSpecies.enabled).toBe(true)
  })

  test('should throw an error if config is invalid', () => {
    delete process.env.TERMS_AND_CONDITIONS_URL
    expect(
      () => getConfig()
    ).toThrow('The server config is invalid. "latestTermsAndConditionsUri" is required')
  })
})
