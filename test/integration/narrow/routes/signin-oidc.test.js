const cheerio = require('cheerio')
const sessionMock = require('../../../../app/session')
jest.mock('../../../../app/session')
const authMock = require('../../../../app/auth')
jest.mock('../../../../app/auth')
const personMock = require('../../../../app/api-requests/rpa-api/person')
jest.mock('../../../../app/api-requests/rpa-api/person')
const organisationMock = require('../../../../app/api-requests/rpa-api/organisation')
jest.mock('../../../../app/api-requests/rpa-api/organisation')
const cphNumbersMock = require('../../../../app/api-requests/rpa-api/cph-numbers')
jest.mock('../../../../app/api-requests/rpa-api/cph-numbers')
const sendIneligibilityEventMock = require('../../../../app/event/raise-ineligibility-event')
jest.mock('../../../../app/event/raise-ineligibility-event')
const cphCheckMock = require('../../../../app/api-requests/rpa-api/cph-check').customerMustHaveAtLeastOneValidCph
jest.mock('../../../../app/api-requests/rpa-api/cph-check')
const getLatestApplicationsBySbiMock = require('../../../../app/api-requests/application-api').getLatestApplicationsBySbi
jest.mock('../../../../app/api-requests/application-api')
const HttpStatus = require('http-status-codes')
const { status } = require('../../../../app/constants/status')

const { InvalidPermissionsError, InvalidStateError, NoEligibleCphError, OutstandingAgreementError, LockedBusinessError, NoEndemicsAgreementError } = require('../../../../app/exceptions')

const stateFromApply = 'eyJpZCI6IjcwOWVkZDZlLWU1NGEtNDE1YS04NTExLWFiNWVkN2ZhZmNkMCIsInNvdXJjZSI6ImFwcGx5In0='
const stateFromClaim = 'eyJpZCI6IjcwOWVkZDZlLWU1NGEtNDE1YS04NTExLWFiNWVkN2ZhZmNkMCIsInNvdXJjZSI6ImNsYWltIn0='
const stateFromDashboard = 'eyJpZCI6IjcwOWVkZDZlLWU1NGEtNDE1YS04NTExLWFiNWVkN2ZhZmNkMCIsInNvdXJjZSI6ImRhc2hib2FyZCJ9'
const YOU_CAN_NOT_APPLY = 'You cannot apply for reviews or follow-ups for this business'
const NO_ENDEMICS_AGREEMENT = 'You do not have an agreement for this business'

describe('Defra ID redirection test', () => {
  function assertLoginAuth ($, expectedMessage = 'Login failed') {
    expect($('.govuk-heading-l').text()).toMatch(expectedMessage)
    assertAuthorizationCodeUrlCalled()
    assertAuthenticateCalled()
  }
  function assertLoginFailed ($, expectedMessage = 'Login failed') {
    expect($('.govuk-heading-l').text()).toMatch(expectedMessage)
  }
  function assertAuthorizationCodeUrlCalled () {
    expect(authMock.requestAuthorizationCodeUrl).toBeCalledTimes(1)
  }
  function assertAuthenticateCalled () {
    expect(authMock.authenticate).toBeCalledTimes(1)
  }
  function assertRetrieveApimAccessTokenCalled () {
    expect(authMock.retrieveApimAccessToken).toBeCalledTimes(1)
  }
  function mockGetLatestApplicationsBySbiMock (type = 'VV', statusId = status.READY_TO_PAY) {
    getLatestApplicationsBySbiMock.mockResolvedValueOnce([
      {
        id: 'bf93ec75-d3a4-434b-8443-511838410640',
        reference: 'AHWR-BF93-EC75',
        data: {
          type,
          reference: null,
          declaration: true,
          offerStatus: 'accepted',
          organisation: [Object],
          confirmCheckDetails: 'yes'
        },
        claimed: false,
        createdAt: '2024-01-23T09:37:23.519Z',
        updatedAt: '2024-01-23T09:37:23.583Z',
        createdBy: 'admin',
        updatedBy: null,
        statusId,
        type
      }
    ])
  }
  jest.mock('../../../../app/config', () => ({
    ...jest.requireActual('../../../../app/config'),
    serviceUri: 'http://localhost:3003',
    applyServiceUri: 'http://localhost:3000/apply',
    claimServiceUri: 'http://localhost:3004/claim',
    authConfig: {
      defraId: {
        enabled: true
      },
      ruralPaymentsAgency: {
        hostname: 'dummy-host-name',
        getPersonSummaryUrl: 'dummy-get-person-summary-url',
        getOrganisationPermissionsUrl: 'dummy-get-organisation-permissions-url',
        getOrganisationUrl: 'dummy-get-organisation-url'
      }
    },
    endemics: {
      enabled: true
    }
  }))

  jest.mock('applicationinsights', () => ({ defaultClient: { trackException: jest.fn(), trackEvent: jest.fn() }, dispose: jest.fn() }))

  const url = '/signin-oidc'

  beforeEach(async () => {
    jest.clearAllMocks()
  })

  const setupMock = function (organisationPermission = false, locked = false) {
    authMock.authenticate.mockResolvedValueOnce({ accessToken: '2323' })
    authMock.retrieveApimAccessToken.mockResolvedValueOnce('Bearer 2323')
    personMock.getPersonSummary.mockResolvedValueOnce({
      firstName: 'Bill',
      middleName: null,
      lastName: 'Smith',
      email: 'billsmith@testemail.com',
      id: 1234567,
      customerReferenceNumber: '1103452436'
    })
    organisationMock.organisationIsEligible.mockResolvedValueOnce({
      organisation: {
        id: 7654321,
        name: 'Mrs Gill Black',
        sbi: 101122201,
        address: {
          address1: 'The Test House',
          address2: 'Test road',
          address3: 'Wicklewood',
          buildingNumberRange: '11',
          buildingName: 'TestHouse',
          street: 'Test ROAD',
          city: 'Test City',
          postalCode: 'TS1 1TS',
          country: 'United Kingdom',
          dependentLocality: 'Test Local'
        },
        email: 'org1@testemail.com',
        locked
      },
      organisationPermission
    })

    sessionMock.getCustomer.mockResolvedValueOnce({
      attachedToMultipleBusinesses: false
    })

    sessionMock.getEndemicsClaim.mockResolvedValueOnce({
      organisation: {
        id: 7654321,
        name: 'Mrs Gill Black',
        sbi: 101122201,
        address: {
          address1: 'The Test House',
          address2: 'Test road',
          address3: 'Wicklewood',
          buildingNumberRange: '11',
          buildingName: 'TestHouse',
          street: 'Test ROAD',
          city: 'Test City',
          postalCode: 'TS1 1TS',
          country: 'United Kingdom',
          dependentLocality: 'Test Local'
        },
        email: 'org1@testemail.com'
      }
    })

    cphNumbersMock.mockResolvedValueOnce([
      '08/178/0064'
    ])
  }

  function verifyResult (res, expectedError, consoleErrorSpy, errorMessage = 'NoEligibleCphError', isLoginFailed = false) {
    expect(res.statusCode).toBe(HttpStatus.StatusCodes.BAD_REQUEST)
    const $ = cheerio.load(res.payload)
    if (isLoginFailed) {
      assertLoginAuth($, YOU_CAN_NOT_APPLY)
    } else {
      assertLoginAuth($, errorMessage)
    }
    assertRetrieveApimAccessTokenCalled()
    expect(personMock.getPersonSummary).toBeCalledTimes(1)
    expect(organisationMock.organisationIsEligible).toBeCalledTimes(1)
    expect(sendIneligibilityEventMock).toBeCalledTimes(1)
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Received error with name ${errorMessage} and message ${expectedError.message}.`)
  }
  function verifyResultForNoEndemicsAgreement (res, expectedError, consoleErrorSpy) {
    expect(res.statusCode).toBe(HttpStatus.StatusCodes.BAD_REQUEST)
    const $ = cheerio.load(res.payload)
    assertLoginFailed($, NO_ENDEMICS_AGREEMENT)
    assertAuthenticateCalled()
    assertRetrieveApimAccessTokenCalled()
    expect(personMock.getPersonSummary).toBeCalledTimes(1)
    expect(organisationMock.organisationIsEligible).toBeCalledTimes(1)
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Received error with name NoEndemicsAgreementError and message ${expectedError.message}`)
  }
  function verifyResult302 (res, locationUrl = '/check-details') {
    expect(res.statusCode).toBe(HttpStatus.StatusCodes.MOVED_TEMPORARILY)
    assertAuthenticateCalled()
    assertRetrieveApimAccessTokenCalled()
    expect(personMock.getPersonSummary).toBeCalledTimes(1)
    expect(organisationMock.organisationIsEligible).toBeCalledTimes(1)
    expect(res.headers.location).toEqual(locationUrl)
  }

  describe(`GET requests to '${url}'`, () => {
    test.each([
      { code: '', state: '' },
      { code: 'sads', state: '' },
      { code: '', state: 'eyJpZCI6IjcwOWVkZDZlLWU1NGEtNDE1YS04NTExLWFiNWVkN2ZhZmNkMCIsInNvdXJjZSI6ImRhc2hib2FyZCJ9' }
    ])('returns 400 and login failed view when empty required query parameters - %p', async ({ code, state }) => {
      const baseUrl = `${url}?code=${code}&state=${state}`
      const options = {
        method: 'GET',
        url: baseUrl
      }

      const res = await global.__SERVER__.inject(options)
      expect(res.statusCode).toBe(HttpStatus.StatusCodes.BAD_REQUEST)
      const $ = cheerio.load(res.payload)
      assertAuthorizationCodeUrlCalled()
      assertLoginFailed($)
    })

    test('returns 400 and login failed view when state missing', async () => {
      const baseUrl = `${url}?code=343432`
      const options = {
        method: 'GET',
        url: baseUrl
      }

      const res = await global.__SERVER__.inject(options)
      expect(res.statusCode).toBe(HttpStatus.StatusCodes.BAD_REQUEST)
      const $ = cheerio.load(res.payload)
      assertAuthorizationCodeUrlCalled()
      assertLoginFailed($)
    })

    test('returns 400 and login failed view when code missing', async () => {
      const baseUrl = `${url}?state=eyJpZCI6IjcwOWVkZDZlLWU1NGEtNDE1YS04NTExLWFiNWVkN2ZhZmNkMCIsInNvdXJjZSI6ImRhc2hib2FyZCJ9`
      const options = {
        method: 'GET',
        url: baseUrl
      }

      const res = await global.__SERVER__.inject(options)
      expect(res.statusCode).toBe(HttpStatus.StatusCodes.BAD_REQUEST)
      const $ = cheerio.load(res.payload)
      assertAuthorizationCodeUrlCalled()
      assertLoginFailed($)
    })

    test('redirects to defra id when state mismatch', async () => {
      const baseUrl = `${url}?code=432432&state=eyJpZCI6IjcwOWVkZDZlLWU1NGEtNDE1YS04NTExLWFiNWVkN2ZhZmNkMCIsInNvdXJjZSI6ImRhc2hib2FyZCJ9`
      const options = {
        method: 'GET',
        url: baseUrl
      }

      authMock.authenticate.mockImplementation(() => {
        throw new InvalidStateError('Invalid state')
      })

      const res = await global.__SERVER__.inject(options)
      expect(res.statusCode).toBe(HttpStatus.StatusCodes.MOVED_TEMPORARILY)
      assertAuthenticateCalled()
      assertAuthorizationCodeUrlCalled()
    })

    test('returns 400 and login failed view when apim access token auth fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error')
      const expectedError = new Error('APIM Access Token Retrieval Failed')
      const baseUrl = `${url}?code=432432&state=eyJpZCI6IjcwOWVkZDZlLWU1NGEtNDE1YS04NTExLWFiNWVkN2ZhZmNkMCIsInNvdXJjZSI6ImRhc2hib2FyZCJ9`
      const options = {
        method: 'GET',
        url: baseUrl
      }

      authMock.authenticate.mockResolvedValueOnce({ accessToken: '2323' })
      authMock.retrieveApimAccessToken.mockImplementation(() => {
        throw new Error('APIM Access Token Retrieval Failed')
      })

      const res = await global.__SERVER__.inject(options)
      expect(res.statusCode).toBe(HttpStatus.StatusCodes.BAD_REQUEST)
      const $ = cheerio.load(res.payload)
      assertRetrieveApimAccessTokenCalled()
      assertLoginAuth($)
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy).toHaveBeenCalledWith(`Received error with name Error and message ${expectedError.message}.`)
    })

    test('returns 400 and exception view when permissions failed', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error')
      const expectedError = new InvalidPermissionsError('Person id 1234567 does not have the required permissions for organisation id 7654321')
      const baseUrl = `${url}?code=432432&state=eyJpZCI6IjcwOWVkZDZlLWU1NGEtNDE1YS04NTExLWFiNWVkN2ZhZmNkMCIsInNvdXJjZSI6ImRhc2hib2FyZCJ9`
      const options = {
        method: 'GET',
        url: baseUrl
      }

      setupMock()
      const res = await global.__SERVER__.inject(options)
      expect(res.statusCode).toBe(HttpStatus.StatusCodes.BAD_REQUEST)
      const $ = cheerio.load(res.payload)
      assertLoginAuth($, YOU_CAN_NOT_APPLY)
      assertRetrieveApimAccessTokenCalled()
      expect(personMock.getPersonSummary).toBeCalledTimes(1)
      expect(organisationMock.organisationIsEligible).toBeCalledTimes(1)
      expect(sendIneligibilityEventMock).toBeCalledTimes(1)
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy).toHaveBeenCalledWith(`Received error with name InvalidPermissionsError and message ${expectedError.message}.`)
    })
    test('returns 400 and exception view when no eligible cph', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error')
      const expectedError = new NoEligibleCphError('Customer must have at least one valid CPH')
      const baseUrl = `${url}?code=432432&state=eyJpZCI6IjcwOWVkZDZlLWU1NGEtNDE1YS04NTExLWFiNWVkN2ZhZmNkMCIsInNvdXJjZSI6ImRhc2hib2FyZCJ9`
      const options = {
        method: 'GET',
        url: baseUrl
      }

      setupMock(true)

      cphCheckMock.mockRejectedValueOnce(expectedError)
      const res = await global.__SERVER__.inject(options)
      verifyResult(res, expectedError, consoleErrorSpy, 'NoEligibleCphError', true)
    })
    test('returns 400 and exception view when business is locked', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error')
      const expectedError = new LockedBusinessError('Organisation id 7654321 is locked by RPA.')
      const baseUrl = `${url}?code=432432&state=eyJpZCI6IjcwOWVkZDZlLWU1NGEtNDE1YS04NTExLWFiNWVkN2ZhZmNkMCIsInNvdXJjZSI6ImRhc2hib2FyZCJ9`
      const options = {
        method: 'GET',
        url: baseUrl
      }

      setupMock(true, true)

      const res = await global.__SERVER__.inject(options)
      expect(res.statusCode).toBe(HttpStatus.StatusCodes.BAD_REQUEST)
      const $ = cheerio.load(res.payload)
      assertLoginAuth($, YOU_CAN_NOT_APPLY)
      assertRetrieveApimAccessTokenCalled()
      expect(personMock.getPersonSummary).toBeCalledTimes(1)
      expect(organisationMock.organisationIsEligible).toBeCalledTimes(1)
      expect(sendIneligibilityEventMock).toBeCalledTimes(1)
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy).toHaveBeenCalledWith(`Received error with name LockedBusinessError and message ${expectedError.message}`)
    })

    test('returns 400 and exception view when there is no agreement and user entered from claim journey', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error')
      const expectedError = new NoEndemicsAgreementError('Business with SBI 101122201 must complete an endemics agreement.')
      const baseUrl = `${url}?code=432432&state=${stateFromClaim}`
      const options = {
        method: 'GET',
        url: baseUrl
      }

      setupMock(true)

      getLatestApplicationsBySbiMock.mockResolvedValueOnce([])

      const res = await global.__SERVER__.inject(options)
      verifyResultForNoEndemicsAgreement(res, expectedError, consoleErrorSpy)
    })

    test('returns 400 and exception view when there is no agreement and user entered from dashboard directly', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error')
      const expectedError = new NoEndemicsAgreementError('Business with SBI 101122201 must complete an endemics agreement.')
      const baseUrl = `${url}?code=432432&state=${stateFromDashboard}`
      const options = {
        method: 'GET',
        url: baseUrl
      }

      setupMock(true)

      getLatestApplicationsBySbiMock.mockResolvedValueOnce([])

      const res = await global.__SERVER__.inject(options)
      verifyResultForNoEndemicsAgreement(res, expectedError, consoleErrorSpy)
    })

    test('returns 302 and redirects user to apply journey if no previous applications and user entered from apply journey', async () => {
      const baseUrl = `${url}?code=432432&state=${stateFromApply}`
      const options = {
        method: 'GET',
        url: baseUrl
      }

      setupMock(true)

      getLatestApplicationsBySbiMock.mockResolvedValueOnce([])

      const res = await global.__SERVER__.inject(options)
      verifyResult302(res, 'http://localhost:3000/apply/endemics/check-details')
    })

    test('returns 302 and redirects user to old claim journey if open application/claim and user entered from claim journey', async () => {
      const baseUrl = `${url}?code=432432&state=${stateFromClaim}`
      const options = {
        method: 'GET',
        url: baseUrl
      }

      setupMock(true)

      mockGetLatestApplicationsBySbiMock('VV', status.AGREED)

      const res = await global.__SERVER__.inject(options)
      verifyResult302(res, 'http://localhost:3004/claim/signin-oidc?state=eyJpZCI6IjcwOWVkZDZlLWU1NGEtNDE1YS04NTExLWFiNWVkN2ZhZmNkMCIsInNvdXJjZSI6ImNsYWltIn0=&code=432432')
    })

    test('returns 302 and redirects user to old claim journey if open application/claim and user entered from dashboard directly', async () => {
      const baseUrl = `${url}?code=432432&state=${stateFromDashboard}`
      const options = {
        method: 'GET',
        url: baseUrl
      }
      setupMock(true)

      mockGetLatestApplicationsBySbiMock('VV', status.AGREED)

      const res = await global.__SERVER__.inject(options)
      verifyResult302(res, 'http://localhost:3004/claim/signin-oidc?state=eyJpZCI6IjcwOWVkZDZlLWU1NGEtNDE1YS04NTExLWFiNWVkN2ZhZmNkMCIsInNvdXJjZSI6ImRhc2hib2FyZCJ9&code=432432')
    })

    test('returns 400 and exception view if open application/claim and user entered from apply journey', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error')
      const expectedError = new OutstandingAgreementError('Business with SBI 101122201 must claim or withdraw agreement before creating another.')
      const baseUrl = `${url}?code=432432&state=${stateFromApply}`
      const options = {
        method: 'GET',
        url: baseUrl
      }

      setupMock(true)

      mockGetLatestApplicationsBySbiMock('VV', status.AGREED)

      const res = await global.__SERVER__.inject(options)
      expect(res.statusCode).toBe(HttpStatus.StatusCodes.BAD_REQUEST)
      assertAuthenticateCalled()
      assertRetrieveApimAccessTokenCalled()
      expect(personMock.getPersonSummary).toBeCalledTimes(1)
      expect(organisationMock.organisationIsEligible).toBeCalledTimes(1)
      const $ = cheerio.load(res.payload)
      assertLoginFailed($, 'You have an existing agreement for this business')
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy).toHaveBeenCalledWith(`Received error with name OutstandingAgreementError and message ${expectedError.message}`)
    })

    test('returns 302 and redirects user to dashboard if endemics agreement and user entered from apply', async () => {
      const baseUrl = `${url}?code=432432&state=${stateFromApply}`
      const options = {
        method: 'GET',
        url: baseUrl
      }

      setupMock(true)

      mockGetLatestApplicationsBySbiMock('EE', status.AGREED)

      const res = await global.__SERVER__.inject(options)
      verifyResult302(res)
    })

    test('returns 302 and redirects user to old claim journey if open application/claim and user entered from dashboard directly', async () => {
      const baseUrl = `${url}?code=432432&state=${stateFromDashboard}`
      const options = {
        method: 'GET',
        url: baseUrl
      }
      setupMock(true)

      mockGetLatestApplicationsBySbiMock('EE', status.NOT_AGREED)

      const res = await global.__SERVER__.inject(options)
      verifyResult302(res, 'http://localhost:3000/apply/endemics/check-details')
    })

    test('returns 302 and redirects user to dashboard if endemics agreement and user entered from claim', async () => {
      const baseUrl = `${url}?code=432432&state=${stateFromClaim}`
      const options = {
        method: 'GET',
        url: baseUrl
      }

      setupMock(true)

      mockGetLatestApplicationsBySbiMock('EE', status.AGREED)

      const res = await global.__SERVER__.inject(options)
      verifyResult302(res)
    })

    test('returns 302 and redirects user to dashboard if endemics agreement and user entered from dashboard', async () => {
      const baseUrl = `${url}?code=432432&state=${stateFromDashboard}`
      const options = {
        method: 'GET',
        url: baseUrl
      }

      setupMock(true)

      mockGetLatestApplicationsBySbiMock('EE', status.AGREED)

      const res = await global.__SERVER__.inject(options)
      verifyResult302(res)
    })

    test('returns 302 and redirects user to endemics apply if last application is a closed VV application and coming from apply', async () => {
      const baseUrl = `${url}?code=432432&state=${stateFromApply}`
      const options = {
        method: 'GET',
        url: baseUrl
      }

      setupMock(true)

      mockGetLatestApplicationsBySbiMock('VV', status.READY_TO_PAY)

      const res = await global.__SERVER__.inject(options)
      verifyResult302(res, 'http://localhost:3000/apply/endemics/check-details')
    })

    test('returns 400 and and exception view if last application is a closed VV application and coming from claim', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error')
      const expectedError = new NoEndemicsAgreementError('Business with SBI 101122201 must complete an endemics agreement.')
      const baseUrl = `${url}?code=432432&state=${stateFromClaim}`
      const options = {
        method: 'GET',
        url: baseUrl
      }

      setupMock(true)

      mockGetLatestApplicationsBySbiMock('VV', status.READY_TO_PAY)

      const res = await global.__SERVER__.inject(options)
      verifyResultForNoEndemicsAgreement(res, expectedError, consoleErrorSpy)
    })

    test('returns 400 and and exception view if last application is a closed VV application and coming from dashboard', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error')
      const expectedError = new NoEndemicsAgreementError('Business with SBI 101122201 must complete an endemics agreement.')
      const baseUrl = `${url}?code=432432&state=${stateFromDashboard}`
      const options = {
        method: 'GET',
        url: baseUrl
      }

      setupMock(true)

      mockGetLatestApplicationsBySbiMock('VV', status.READY_TO_PAY)

      const res = await global.__SERVER__.inject(options)
      verifyResultForNoEndemicsAgreement(res, expectedError, consoleErrorSpy)
    })
  })
})
