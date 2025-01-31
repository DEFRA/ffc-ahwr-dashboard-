require('./insights').setup()
const createServer = require('./server')

let server

createServer()
  .then(_server => {
    server = _server
    server.start()
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

process.on('SIGINT', () => {
  server.stop()
    .then(() => {
      process.exit(0)
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
})
