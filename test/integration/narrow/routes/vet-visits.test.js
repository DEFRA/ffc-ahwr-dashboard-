const { getEndemicsClaim, getCustomer } = require('../../../../app/session')
const { vetVisits } = require('../../../../app/config/routes')
const {
  getLatestApplicationsBySbi
} = require('../../../../app/api-requests/application-api')
const cheerio = require('cheerio')

jest.mock('../../../../app/session')
jest.mock('../../../../app/api-requests/application-api')
const HttpStatus = require('http-status-codes')

describe('Claim vet-visits', () => {
  const url = `/${vetVisits}`

  test('GET /vet-visits route returns 200', async () => {
    const options = {
      method: 'GET',
      url,
      auth: {
        strategy: 'cookie',
        credentials: { reference: 'AHWR-2470-6BA9', sbi: '112670111' }
      }
    }

    getEndemicsClaim.mockReturnValueOnce({
      organisation: {
        sbi: '112670111',
        farmerName: 'Anjana Donald Jaroslav Daniel Gooder',
        name: 'Kathryn Jeffery'
      }
    })
    getCustomer.mockReturnValueOnce({
      attachedToMultipleBusinesses: true
    })

    await getLatestApplicationsBySbi.mockReturnValueOnce([
      {
        reference: 'AHWR-2470-6BA9',
        type: 'EE'
      }
    ])

    const response = await global.__SERVER__.inject(options)
    const $ = cheerio.load(response.payload)
    const SBIText = 'Single Business Identifier (SBI): 112670111'

    expect($('#SBI').text()).toEqual(SBIText)
    expect($('#MBILink').text()).toEqual('Apply for a different business')
    expect(response.statusCode).toBe(HttpStatus.StatusCodes.OK)
  })
  test('GET /vet-visits route returns 302', async () => {
    const options = {
      method: 'GET',
      url,
      auth: false
    }

    getEndemicsClaim.mockReturnValueOnce({
      organisation: {
        sbi: '112670111',
        farmerName: 'Anjana Donald Jaroslav Daniel Gooder',
        name: 'Kathryn Jeffery'
      }
    })
    getCustomer.mockReturnValueOnce({
      attachedToMultipleBusinesses: false
    })

    await getLatestApplicationsBySbi.mockReturnValueOnce([
      {
        reference: 'AHWR-2470-6BA9',
        type: 'EE'
      }
    ])

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(HttpStatus.StatusCodes.MOVED_TEMPORARILY)
  })
})
