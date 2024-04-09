const { checkStatusTenMonths } = require('../../../../../app/routes/utils/checks')

describe('checkStatusTenMonths', () => {
  test('should return true if claimData contains a claim within the last ten months with a valid status', () => {
    const claimData = [
      { data: {visitDate: new Date('2024-01-01')}, statusId: 8 },
      { data: {visitDate: new Date('2024-02-01')}, statusId: 8 },
      { data: {visitDate: new Date('2024-03-01')}, statusId: 8 }
    ]

    const result = checkStatusTenMonths(claimData)

    expect(result).toBe(true)
  })

  test('should return false if claimData does not contain a claim within the last ten months', () => {
    const claimData = [
      { data: {visitDate: new Date('2021-01-01')}, statusId: 8 },
      { data: {visitDate: new Date('2021-02-01')}, statusId: 5 },
      { data: {visitDate: new Date('2021-03-01')}, statusId: 9 }
    ]

    const result = checkStatusTenMonths(claimData)

    expect(result).toBe(false)
  })

  test('should return false if claimData contains a claim within the last ten months but with an invalid status', () => {
    const claimData = [
      { data: {visitDate: new Date('2022-01-01')}, statusId: 1 },
      { data: {visitDate: new Date('2022-02-01')}, statusId: 8 },
      { data: {visitDate: new Date('2022-03-01')}, statusId: 8 }
    ]

    const result = checkStatusTenMonths(claimData)

    expect(result).toBe(false)
  })
})
