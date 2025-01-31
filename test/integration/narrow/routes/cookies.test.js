const globalJsdom = require('global-jsdom')
const { getByRole } = require('@testing-library/dom')
const { userEvent } = require('@testing-library/user-event')
const createServer = require('../../../../app/server')
const { captureFormData } = require('../../../helpers/capture-form-data')

test('get /cookies', async () => {
  const server = await createServer()

  const policy = {
    confirmed: true,
    essential: true,
    analytics: false
  }
  const cookie = Buffer.from(JSON.stringify(policy)).toString('base64')

  const res = await server.inject({
    url: '/cookies',
    headers: {
      cookie: `ffc_ahwr_cookie_policy=${cookie}`
    }
  })

  globalJsdom(res.payload)

  const user = userEvent.setup({ document })
  const { formdata } = captureFormData()

  const yes = getByRole(document.body, 'radio', { name: 'Yes' })
  const submit = getByRole(document.body, 'button', { name: 'Save cookie settings' })

  await user.click(submit)
  expect(formdata()).toEqual({
    analytics: 'false',
    async: 'false'
  })

  await user.click(yes)
  await user.click(submit)
  expect(formdata()).toEqual({
    analytics: 'true',
    async: 'false'
  })
})

test('get /cookies: defaults to false', async () => {
  const server = await createServer()

  const res = await server.inject({
    url: '/cookies'
  })

  globalJsdom(res.payload)

  const user = userEvent.setup({ document })
  const { formdata } = captureFormData()

  const submit = getByRole(document.body, 'button', { name: 'Save cookie settings' })

  await user.click(submit)
  expect(formdata()).toEqual({
    analytics: 'false',
    async: 'false'
  })
})

test('post /cookies: from banner, async true', async () => {
  const server = await createServer()

  const res = await server.inject({
    url: '/cookies',
    method: 'post',
    payload: {
      analytics: 'true',
      async: 'true'
    }
  })

  expect(res.statusCode).toBe(200)
  expect(res.payload).toBe('ok')
})

test('post /cookies: from page, async false', async () => {
  const server = await createServer()

  const res = await server.inject({
    url: '/cookies',
    method: 'post',
    payload: {
      analytics: 'true',
      async: 'false'
    }
  })

  expect(res.statusCode).toBe(302)
  expect(res.headers.location).toBe('/cookies?updated=true')
})
