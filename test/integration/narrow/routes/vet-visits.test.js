const { getFarmerApplyData } = require('../../../../app/session')
const {
  getLatestApplicationsBySbi
} = require('../../../../app/api-requests/application-api')

jest.mock('../../../../app/session')
jest.mock('../../../../app/api-requests/application-api')

describe('Claim vet-visits', () => {
  test('GET /claim/vet-visits route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/claim/vet-visits',
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
    expect(response.statusCode).toBe(200)
  })
})
