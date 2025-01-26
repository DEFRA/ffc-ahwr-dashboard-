const config = require('./config')
import Hapi from '@hapi/hapi'
import hapiCookiePlugin from '@hapi/cookie'
import hapiInertPlugin from '@hapi/inert'
import catboxRedis from '@hapi/catbox-redis'
import catboxMemory from '@hapi/catbox-memory'
import { headerPlugin } from './plugins/header.js'
const cacheConfig = config.useRedis ? config.cache.options : {}

const catbox = config.useRedis
    ? catboxRedis
    : catboxMemory

export async function createServer () {
  const server = Hapi.server({
    cache: [{
      provider: {
        constructor: catbox,
        options: cacheConfig
      }
    }],
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    },
    router: {
      stripTrailingSlash: true
    }
  })

  await server.register(require('./plugins/crumb'))
  await server.register(hapiCookiePlugin)
  await server.register(hapiInertPlugin)
  await server.register(require('./plugins/auth-plugin'))
  await server.register(require('./plugins/cookies'))
  await server.register(require('./plugins/error-pages'))
  await server.register(require('./plugins/logger'))
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/session'))
  await server.register(require('./plugins/view-context'))
  await server.register(require('./plugins/views'))
  await server.register(headerPlugin)

  return server
}
