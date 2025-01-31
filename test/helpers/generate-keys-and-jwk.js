const { generateKeyPairSync } = require('crypto')
const parseASN1 = require('parse-asn1')

const generateKeys = () => {
  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  })

  return { publicKey, privateKey }
}

const generateJWK = (pem) => {
  const parsed = parseASN1(pem)
  const n = Buffer
    .from(parsed.modulus.toArray())
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/(=*)$/, '')

  const jwk = {
    kty: 'RSA',
    n,
    e: 'AQAB',
    alg: 'RS256',
    kid: 'test',
    use: 'sig'
  }

  return jwk
}

module.exports = { generateKeys, generateJWK }
