const { checkReviewIsPaidOrReadyToPayAndWithinLastTenMonths } = require('../../../../../app/routes/utils/checks')

describe('checkReviewIsPaidOrReadyToPayAndWithinLastTenMonths', () => {
  let mockClaimApi
  beforeAll(async () => {
    mockClaimApi = require('../../../../../app/api-requests/claim-api')
    jest.mock('../../../../../app/api-requests/claim-api')
  })

  test('should return true if claimData contains a claim within the last ten months with a valid status', () => {
    mockClaimApi.isWithInLastTenMonths.mockReturnValue(true)
    const claimData = [
      { data: { visitDate: new Date('2024-01-01') }, statusId: 8, type: 'VV' },
      { data: { visitDate: new Date('2024-02-01') }, statusId: 8, type: 'R' },
      { data: { visitDate: new Date('2024-03-01') }, statusId: 8, type: 'VV' }
    ]

    const result = checkReviewIsPaidOrReadyToPayAndWithinLastTenMonths(claimData)

    expect(result).toBeTruthy()
  })

  test('should return false if claimData does not contain a claim within the last ten months', () => {
    mockClaimApi.isWithInLastTenMonths.mockReturnValue(false)
    const claimData = [
      { data: { visitDate: new Date('2021-01-01') }, statusId: 8, type: 'VV' },
      { data: { visitDate: new Date('2021-01-01') }, statusId: 8, type: 'VV' },
      { data: { visitDate: new Date('2021-02-01') }, statusId: 9, type: 'R' },
      { data: { visitDate: new Date('2021-02-01') }, statusId: 9, type: 'R' }
    ]

    const result = checkReviewIsPaidOrReadyToPayAndWithinLastTenMonths(claimData)

    expect(result).toBeFalsy()
  })

  test('should return false if claimData contains a claim within the last ten months but with an invalid status', () => {
    mockClaimApi.isWithInLastTenMonths.mockReturnValue(true)
    const claimData = [
      { data: { visitDate: new Date('2022-01-01') }, statusId: 1, type: 'VV' },
      { data: { visitDate: new Date('2022-02-01') }, statusId: 2, type: 'R' },
      { data: { visitDate: new Date('2022-02-01') }, statusId: 5, type: 'VV' },
      { data: { visitDate: new Date('2022-02-01') }, statusId: 3, type: 'R' }
    ]

    const result = checkReviewIsPaidOrReadyToPayAndWithinLastTenMonths(claimData)

    expect(result).toBeFalsy()
  })
})
