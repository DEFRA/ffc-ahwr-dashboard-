const wreck = require('@hapi/wreck')
const session = require('../../session')
const { tokens } = require('../../session/keys')
const config = require('../../config')
const apiHeaders = require('../../constants/api-headers')

const get = async (hostname, url, request, headers = {}) => {
  const token = await session.getToken(request, tokens.accessToken)

  headers[apiHeaders.xForwardedAuthorization] = token
  headers[apiHeaders.ocpSubscriptionKey] = config.authConfig.apim.ocpSubscriptionKey
  const endpoint = `${hostname}${url}`

  try {
    const { payload } = await wreck.get(endpoint,
      {
        headers,
        json: true,
        rejectUnauthorized: false,
        timeout: config.wreckHttp.timeoutMilliseconds
      })

    return payload
  } catch (err) {
    request.logger.setBindings({ err, endpoint })
    throw err
  }
}

module.exports = {
  get
}
