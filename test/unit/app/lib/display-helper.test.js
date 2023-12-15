const { upperFirstLetter, formatedDateToUk } = require('../../../../app/lib/display-helper')

describe('Display helper tests', () => {
  test('upperFirstLetter - empty string', async () => {
    expect(upperFirstLetter('')).toEqual('')
  })

  test('upperFirstLetter - string', async () => {
    expect(upperFirstLetter('string')).toEqual('String')
  })

  test('upperFirstLetter - number string', async () => {
    expect(upperFirstLetter('12345')).toEqual('12345')
  })

  test('formatedDateToUk - YYYYMMDD', async () => {
    expect(formatedDateToUk('2023-10-16')).toEqual('16/10/2023')
  })

  test('formatedDateToUk - MMDDYYYY', async () => {
    expect(formatedDateToUk('10-16-2023')).toEqual('16/10/2023')
  })
})
