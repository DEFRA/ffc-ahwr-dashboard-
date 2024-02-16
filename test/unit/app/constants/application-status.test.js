// Import the module you're testing
const statusCodes = require('../../../../app/constants/application-status')

describe('Status Codes Module', () => {
  // Test to ensure the object contains all expected keys with correct values
  test('should have all required status codes with correct values', () => {
    const expectedStatusCodes = {
      agreed: 1,
      withdrawn: 2,
      dataInputted: 3,
      claimed: 4,
      inCheck: 5,
      accepted: 6,
      notAgreed: 7,
      paid: 8,
      readyToPay: 9,
      rejected: 10
    }

    // Check if the exported object matches the expected object
    expect(statusCodes).toEqual(expectedStatusCodes)
  })

  // Additional tests could include checking the type of the export
  test('should export an object', () => {
    expect(typeof statusCodes).toBe('object')
  })

  // You can also add tests for individual properties if needed
  test('should have the correct value for "agreed"', () => {
    expect(statusCodes.agreed).toBe(1)
  })

  test('should have the correct value for "agreed"', () => {
    expect(statusCodes.agreed).toBe(1)
  })

  test('should have the correct value for "withdrawn"', () => {
    expect(statusCodes.withdrawn).toBe(2)
  })

  test('should have the correct value for "dataInputted"', () => {
    expect(statusCodes.dataInputted).toBe(3)
  })

  test('should have the correct value for "claimed"', () => {
    expect(statusCodes.claimed).toBe(4)
  })

  test('should have the correct value for "inCheck"', () => {
    expect(statusCodes.inCheck).toBe(5)
  })

  test('should have the correct value for "accepted"', () => {
    expect(statusCodes.accepted).toBe(6)
  })

  test('should have the correct value for "notAgreed"', () => {
    expect(statusCodes.notAgreed).toBe(7)
  })

  test('should have the correct value for "paid"', () => {
    expect(statusCodes.paid).toBe(8)
  })

  test('should have the correct value for "readyToPay"', () => {
    expect(statusCodes.readyToPay).toBe(9)
  })

  test('should have the correct value for "rejected"', () => {
    expect(statusCodes.rejected).toBe(10)
  })
})
