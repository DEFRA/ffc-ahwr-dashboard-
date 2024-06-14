const { checkReviewIsPaidOrReadyToPay } = require('../../../../../app/routes/utils/checks')

describe('checkReviewIsPaidOrReadyToPay', () => {
  let mockClaimApi
  beforeAll(async () => {
    mockClaimApi = require('../../../../../app/api-requests/claim-api')
    jest.mock('../../../../../app/api-requests/claim-api')
  })

  test.each([
    { data: { visitDate: new Date('2024-01-01') }, statusId: 8, type: 'VV' },
    { data: { visitDate: new Date('2024-02-01') }, statusId: 8, type: 'R' },
    { data: { visitDate: new Date('2024-03-01') }, statusId: 9, type: 'VV' },
    { data: { visitDate: new Date('2024-03-01') }, statusId: 9, type: 'R' }
  ])('should return true if claimData contains a claim with a valid status', (claimData) => {
    mockClaimApi.isWithinLastTenMonths.mockReturnValue(true)

    const result = checkReviewIsPaidOrReadyToPay([claimData])

    expect(result).toBeTruthy()
  })

  test.each([
    { data: { visitDate: new Date('2024-01-01') }, statusId: 1, type: 'VV' },
    { data: { visitDate: new Date('2024-02-01') }, statusId: 2, type: 'R' },
    { data: { visitDate: new Date('2024-03-01') }, statusId: 3, type: 'VV' },
    { data: { visitDate: new Date('2024-03-01') }, statusId: 4, type: 'R' }
  ])('should return false if claimData contains a claim with an invalid status', (claimData) => {
    mockClaimApi.isWithinLastTenMonths.mockReturnValue(true)

    const result = checkReviewIsPaidOrReadyToPay([claimData])

    expect(result).toBeFalsy()
  })

  test.each([
    { data: { visitDate: new Date('2024-01-01') }, statusId: 8, type: 'EE' },
    { data: { visitDate: new Date('2024-02-01') }, statusId: 8, type: 'EE' },
    { data: { visitDate: new Date('2024-03-01') }, statusId: 9, type: 'EE' },
    { data: { visitDate: new Date('2024-03-01') }, statusId: 9, type: 'EE' }
  ])('should return false if claimData contains a claim with a valid status but invalid type', (claimData) => {
    mockClaimApi.isWithinLastTenMonths.mockReturnValue(true)

    const result = checkReviewIsPaidOrReadyToPay([claimData])

    expect(result).toBeFalsy()
  })

})
