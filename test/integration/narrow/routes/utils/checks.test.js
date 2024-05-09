const { checkReviewIsPaidOrReadyToPayAndWithinLastTenMonths } = require('../../../../../app/routes/utils/checks')

describe('checkReviewIsPaidOrReadyToPayAndWithinLastTenMonths', () => {
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
  ])('should return true if claimData contains a claim within the last ten months with a valid status', (claimData) => {
    mockClaimApi.isWithInLastTenMonths.mockReturnValue(true)

    const result = checkReviewIsPaidOrReadyToPayAndWithinLastTenMonths([claimData])

    expect(result).toBeTruthy()
  })

  test.each([
    { data: { visitDate: new Date('2021-01-01') }, statusId: 8, type: 'VV' },
    { data: { visitDate: new Date('2021-01-01') }, statusId: 8, type: 'VV' },
    { data: { visitDate: new Date('2021-02-01') }, statusId: 9, type: 'R' },
    { data: { visitDate: new Date('2021-02-01') }, statusId: 9, type: 'R' }
  ])('should return false if claimData does not contain a claim within the last ten months', (claimData) => {
    mockClaimApi.isWithInLastTenMonths.mockReturnValue(false)

    const result = checkReviewIsPaidOrReadyToPayAndWithinLastTenMonths([claimData])

    expect(result).toBeFalsy()
  })

  test.each([
    { data: { visitDate: new Date('2022-01-01') }, statusId: 1, type: 'VV' },
    { data: { visitDate: new Date('2022-02-01') }, statusId: 2, type: 'R' },
    { data: { visitDate: new Date('2022-02-01') }, statusId: 5, type: 'VV' },
    { data: { visitDate: new Date('2022-02-01') }, statusId: 3, type: 'R' }
  ])('should return false if claimData contains a claim within the last ten months but with an invalid status', (claimData) => {
    mockClaimApi.isWithInLastTenMonths.mockReturnValue(true)

    const result = checkReviewIsPaidOrReadyToPayAndWithinLastTenMonths([claimData])

    expect(result).toBeFalsy()
  })
})
