// Assuming your files are structured in a way that you can require these modules
const createServer = require('../../../app/server')

jest.mock('../../../app/insights', () => ({
  setup: jest.fn()
}))

jest.mock('../../../app/server', () => jest.fn().mockResolvedValue({
  start: jest.fn().mockResolvedValue(undefined),
  stop: jest.fn().mockResolvedValue(undefined),
  initialize: jest.fn().mockResolvedValue(undefined)
}))

describe('Server initialization and shutdown', () => {
  let server

  beforeAll(async () => {
    // Mock process.exit to prevent tests from exiting
    jest.spyOn(process, 'exit').mockImplementation(() => {})

    // Mock console.error to prevent logging errors during tests
    jest.spyOn(console, 'error').mockImplementation(() => {})

    // Mock process.on to test signal handling
    jest.spyOn(process, 'on').mockImplementation((signal, callback) => {
      if (signal === 'SIGINT') {
        callback()
      }
    })

    server = await createServer()
    server.initialize()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  test('createServer creates a server instance', () => {
    expect(createServer).toHaveBeenCalled()
    expect(server).toBeDefined()
    expect(server.start).toBeDefined()
    expect(server.stop).toBeDefined()
  })

  test('server starts successfully', async () => {
    await server.start()
    expect(server.start).toHaveBeenCalled()
  })

  test('server stops on SIGINT signal', async () => {
    // Trigger SIGINT signal handling
    process.emit('SIGINT')

    expect(server.stop).toHaveBeenCalled()
    expect(process.exit).toHaveBeenCalledTimes(0)
  })

  test('server handles start and stop errors', async () => {
    // Re-mock the server to simulate an error on start
    createServer.mockResolvedValueOnce({
      start: jest.fn().mockRejectedValue(new Error('Start Error')),
      stop: jest.fn().mockRejectedValue(new Error('Stop Error')),
      initialize: jest.fn().mockRejectedValue(new Error('Initialize Error'))
    })
    const createNewServer = require('../../../app/server')
    // Re-initialize to simulate error
    const errorServer = await createNewServer()
    try {
      await errorServer.start()
    } catch (error) {
      expect(error).toEqual(new Error('Start Error'))
    }

    // Simulate SIGINT to test stop error handling
    try {
      await errorServer.stop()
    } catch (error) {
      expect(error).toEqual(new Error('Stop Error'))
    }
  })
})
