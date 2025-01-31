// Import the regular expression string
const uuidRegexString = require('../../../../app/config/uuid-regex')
// Convert the string to a RegExp object
const uuidRegex = new RegExp(uuidRegexString)

describe('UUID Regular Expression', () => {
  // Test cases for valid UUIDs
  test.each([
    '123e4567-e89b-12d3-a456-426614174000',
    'c56a4180-65aa-42ec-a945-5fd21dec0538'
  ])('should match valid UUID "%s"', (uuid) => {
    expect(uuidRegex.test(uuid)).toBeTruthy()
  })

  // Test cases for invalid UUIDs
  test.each([
    '12345678-1234-1234-1234--1234567890123', // Too long
    'g56a4180-65aa-42ec-a945-5fd21dec0538', // Contains a 'g'
    '', // Empty string
    'not-a-uuid' // Completely incorrect format
  ])('should not match invalid UUID "%s"', (uuid) => {
    expect(uuidRegex.test(uuid)).toBeFalsy()
  })

  // Test to ensure the regex string is correctly formatted
  test('should be a correctly formatted regex string for UUIDs', () => {
    const expectedRegexString = '[\\da-f]{8}\\b-[\\da-f]{4}\\b-[\\da-f]{4}\\b-[\\da-f]{4}\\b-[\\da-f]{12}'
    expect(uuidRegexString).toBe(expectedRegexString)
  })
})
