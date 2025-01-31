const globalJsdom = require('global-jsdom')
const { getByRole } = require('@testing-library/dom')
const config = require('../../../../app/config')
const createServer = require('../../../../app/server')
const { setServerState } = require('../../../helpers/set-server-state')

test('get /download-application', async () => {
  const server = await createServer()

  jest.replaceProperty(config.storage, 'useConnectionString', false)

  const sbi = '106354662'
  const reference = 'RESH-A89F-7776'
  const state = {
    endemicsClaim: {
      organisation: {
        sbi
      },
      LatestEndemicsApplicationReference: reference
    }
  }

  setServerState(server, state)

  const res = await server.inject({
    url: `/download-application/${sbi}/${reference}`,
    auth: {
      credentials: {},
      strategy: 'cookie'
    }
  })

  expect(res.payload).toBe(`${sbi}/${reference}.pdf`)
})

test('get /download-application, reference mismatch', async () => {
  const server = await createServer()

  const sbi = '106354662'
  const LatestEndemicsApplicationReference = 'RESH-A101-1111'
  const reference = 'RESH-A202-2222'
  const state = {
    endemicsClaim: {
      organisation: {
        sbi
      },
      LatestEndemicsApplicationReference
    }
  }

  setServerState(server, state)

  const res = await server.inject({
    url: `/download-application/${sbi}/${reference}`,
    auth: {
      credentials: {},
      strategy: 'cookie'
    }
  })

  globalJsdom(res.payload)

  expect(res.statusCode).toBe(404)
  expect(getByRole(document.body, 'heading', { level: 1, name: '404 - Not Found' }))
    .toBeDefined()
})

test('get /download-application, sbi mismatch', async () => {
  const server = await createServer()

  const sbi = '123456789'
  const organisationSbi = '111111111'
  const reference = 'RESH-A303-3333'
  const state = {
    endemicsClaim: {
      organisation: {
        sbi: organisationSbi
      },
      LatestEndemicsApplicationReference: reference
    }
  }

  setServerState(server, state)

  const res = await server.inject({
    url: `/download-application/${sbi}/${reference}`,
    auth: {
      credentials: {},
      strategy: 'cookie'
    }
  })

  globalJsdom(res.payload)

  expect(res.statusCode).toBe(404)
  expect(getByRole(document.body, 'heading', { level: 1, name: '404 - Not Found' }))
    .toBeDefined()
})
