const { checkStatusTenMonths } = require('../../../../../app/routes/utils/checks')

describe('checkStatusTenMonths', () => {
  test('should return true if claimData contains a claim within the last ten months with a valid status', () => {
    const claimData = [
      { data: { visitDate: new Date('2024-01-01') }, statusId: 8, type: 'VV' },
      { data: { visitDate: new Date('2024-02-01') }, statusId: 8, type: 'R' },
      { data: { visitDate: new Date('2024-03-01') }, statusId: 8, type: 'VV' }
    ]

    const result = checkStatusTenMonths(claimData)

    expect(result).toBeTruthy()
  })

  test('should return false if claimData does not contain a claim within the last ten months', () => {
    const claimData = [
      { data: { visitDate: new Date('2021-01-01') }, statusId: 8, type: 'VV' },
      { data: { visitDate: new Date('2021-02-01') }, statusId: 5, type: 'R' },
      { data: { visitDate: new Date('2021-03-01') }, statusId: 9, type: 'VV' }
    ]

    const result = checkStatusTenMonths(claimData)

    expect(result).toBeFalsy()
  })

  test('should return false if claimData contains a claim within the last ten months but with an invalid status', () => {
    const claimData = [
      { data: { visitDate: new Date('2022-01-01') }, statusId: 1, type: 'VV' },
      { data: { visitDate: new Date('2022-02-01') }, statusId: 8, type: 'R' },
      { data: { visitDate: new Date('2022-03-01') }, statusId: 8, type: 'VV' }
    ]

    const result = checkStatusTenMonths(claimData)

    expect(result).toBeFalsy()
  })
})
