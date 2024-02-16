// Import the permissions object from where it's defined
const permissions = require('../../../../app/auth/permissions')

describe('Permissions Module', () => {
  // Test to ensure the permissions object contains all expected keys with correct values
  test('should contain correct permission roles', () => {
    const expectedPermissions = {
      administrator: 'administrator',
      processor: 'processor',
      user: 'user',
      recommender: 'recommender',
      authoriser: 'authoriser'
    }

    // Check if the exported permissions object matches the expected object
    expect(permissions).toEqual(expectedPermissions)
  })

  // Test to ensure no additional keys are present
  test('should not contain unexpected keys', () => {
    const permissionKeys = Object.keys(permissions)
    const expectedKeys = ['administrator', 'processor', 'user', 'recommender', 'authoriser']

    // Check if there are any keys in permissions that are not in expectedKeys
    const hasUnexpectedKeys = permissionKeys.some(key => !expectedKeys.includes(key))

    expect(hasUnexpectedKeys).toBeFalsy()
  })

  // Individual tests for each permission, ensuring each key maps to the correct value
  test('administrator should have correct value', () => {
    expect(permissions.administrator).toBe('administrator')
  })

  test('processor should have correct value', () => {
    expect(permissions.processor).toBe('processor')
  })

  test('user should have correct value', () => {
    expect(permissions.user).toBe('user')
  })

  test('recommender should have correct value', () => {
    expect(permissions.recommender).toBe('recommender')
  })

  test('authoriser should have correct value', () => {
    expect(permissions.authoriser).toBe('authoriser')
  })
})
