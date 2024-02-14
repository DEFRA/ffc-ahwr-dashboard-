const jwt = require('jsonwebtoken')
const tokenSlicer = 5
const decodeJwt = (token) => {
  console.log(`${new Date().toISOString()} Decoding JWT token: ${JSON.stringify({
    token: `${token.slice(0, tokenSlicer)}...${token.slice(-tokenSlicer)}`
  })}`)
  try {
    const decodedToken = jwt.decode(token, { complete: true })
    if (!decodedToken) {
      throw new Error('The token has not been decoded')
    }
    return decodedToken.payload
  } catch (error) {
    console.log(`${new Date().toISOString()} Error while decoding JWT token: ${error.message}`)
    console.error(error)
    return undefined
  }
}

module.exports = decodeJwt
