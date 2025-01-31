const { randomUUID } = require('node:crypto')
const session = require('../../session')
const { tokens } = require('../../session/keys')
const config = require('../../config')

const generate = (request, source = 'dashboard') => {
  const state = {
    id: randomUUID(),
    namespace: config.namespace,
    source
  }

  const base64EncodedState = Buffer.from(JSON.stringify(state)).toString('base64')
  session.setToken(request, tokens.state, base64EncodedState)
  return base64EncodedState
}

const verify = (request) => {
  if (!request.query.error) {
    const state = request.query.state
    if (!state) {
      return false
    }
    const decodedState = JSON.parse(Buffer.from(state, 'base64').toString('ascii'))
    const sessionState = session.getToken(request, tokens.state)
    if (sessionState === undefined) {
      return false
    }
    const savedState = JSON.parse(Buffer.from(sessionState, 'base64').toString('ascii'))
    return decodedState.id === savedState.id
  } else {
    request.logger.setBindings({ err: request.query.error })
    return false
  }
}

module.exports = {
  generate,
  verify
}
