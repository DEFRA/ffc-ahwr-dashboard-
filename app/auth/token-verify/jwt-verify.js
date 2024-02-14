const jwt = require('jsonwebtoken')
const jwktopem = require('jwk-to-pem')
const acquireSigningKey = require('./acquire-signing-key')
const tokenSlicer = 5
const jwtVerify = async (token) => {
  console.log(`${new Date().toISOString()} Verifying JWT token: ${JSON.stringify({
    token: `${token.slice(0, tokenSlicer)}...${token.slice(-tokenSlicer)}`
  })}`)
  try {
    const jwk = await acquireSigningKey()
    const publicKey = jwktopem(jwk)
    const decoded = await jwt.verify(token, publicKey, { algorithms: ['RS256'], ignoreNotBefore: true })
    if (!decoded) {
      throw new Error('The token has not been verified')
    }
  } catch (error) {
    console.log(`${new Date().toISOString()} Error while verifying JWT token: ${error.message}`)
    console.error(error)
    throw error
  }
}

module.exports = jwtVerify
