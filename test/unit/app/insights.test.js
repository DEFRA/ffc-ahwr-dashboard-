const HttpStatus = require('http-status-codes')
describe('App Insight', () => {
  const appInsights = require('applicationinsights')
  const cloudRoleTag = 'cloudRoleTag'
  const tags = {}
  appInsights.defaultClient = {
    context: {
      keys: {
        cloudRole: cloudRoleTag
      },
      tags
    },
    trackException: jest.fn()
  }

  const appInsightsKey = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING

  beforeEach(() => {
    delete process.env.APPLICATIONINSIGHTS_CONNECTION_STRING
  })

  afterAll(() => {
    process.env.APPLICATIONINSIGHTS_CONNECTION_STRING = appInsightsKey
  })

  test('is started when env var exists', () => {
    const consoleLogSpy = jest.spyOn(console, 'log')
    const appName = 'test-app'
    process.env.APPINSIGHTS_CLOUDROLE = appName
    process.env.APPLICATIONINSIGHTS_CONNECTION_STRING = 'something'
    const insights = require('../../../app/insights')

    insights.setup()

    expect(appInsights.start).toHaveBeenCalledTimes(1)
    expect(tags[cloudRoleTag]).toEqual(appName)
    expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    expect(consoleLogSpy).toHaveBeenCalledWith('App Insights Running')
  })

  test('logs not running when env var does not exist', () => {
    const consoleLogSpy = jest.spyOn(console, 'log')
    const insights = require('../../../app/insights')

    insights.setup()

    expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    expect(consoleLogSpy).toHaveBeenCalledWith('App Insights Not Running!')
  })

  test('logException', () => {
    const { logException } = require('../../../app/insights')

    expect(logException).toBeDefined()

    logException({}, {})

    const event = {
      error: 'mock_error',
      request: 'mock_request'
    }

    let req = {
      statusCode: HttpStatus.StatusCodes.OK,
      yar: { id: 'mock_id' },
      payload: 'mock_payload'
    }
    logException(req, event)
    expect(appInsights.defaultClient.trackException).toHaveBeenCalled()

    req = {
      statusCode: HttpStatus.StatusCodes.OK,
      payload: 'mock_payload'
    }
    expect(appInsights.defaultClient.trackException).toHaveBeenCalled()
  })
})
