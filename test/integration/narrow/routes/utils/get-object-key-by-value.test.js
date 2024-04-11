const { getObjectKeyByValue } = require('../../../../../app/routes/utils/get-object-key-by-value')

describe('getObjectKeyByValue', () => {
  it('should return the key of the given value in the object', () => {
    const object = { a: 1, b: 2, c: 3 }
    const value = 2
    const expectedKey = 'b'

    const result = getObjectKeyByValue(object, value)

    expect(result).toMatch(expectedKey)
  })

  it('should return undefined if the value is not found in the object', () => {
    const object = { a: 1, b: 2, c: 3 }
    const value = 4

    const result = getObjectKeyByValue(object, value)

    expect(result).toBeUndefined()
  })
})
