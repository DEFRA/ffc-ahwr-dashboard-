const { getFarmerApplyData } = require('../../../../app/session')
const { vetVisits } = require('../../../../app/config/routes')
const {
  getLatestApplicationsBySbi
} = require('../../../../app/api-requests/application-api')
const cheerio = require('cheerio')

jest.mock('../../../../app/session')
jest.mock('../../../../app/api-requests/application-api')

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

    getFarmerApplyData.mockReturnValueOnce({
      organisation: {
        sbi: '112670111',
        farmerName: 'Anjana Donald Jaroslav Daniel Gooder',
        name: 'Kathryn Jeffery'
      }
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
    expect(response.statusCode).toBe(200)
  })
  test('GET /vet-visits route returns 302', async () => {
    const options = {
      method: 'GET',
      url,
      auth: false
    }

    getFarmerApplyData.mockReturnValueOnce({
      organisation: {
        sbi: '112670111',
        farmerName: 'Anjana Donald Jaroslav Daniel Gooder',
        name: 'Kathryn Jeffery'
      }
    })

    await getLatestApplicationsBySbi.mockReturnValueOnce([
      {
        reference: 'AHWR-2470-6BA9',
        type: 'EE'
      }
    ])

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
  })
})
