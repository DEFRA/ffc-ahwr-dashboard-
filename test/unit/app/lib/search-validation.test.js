const searchValidation = require('../../../../app/lib/search-validation')

describe('Search validation tests', () => {
  test('Search validation - empty string', async () => {
    expect(searchValidation('')).toEqual({ searchText: '', searchType: 'reset' })
  })

  test('Search validation - reference', async () => {
    expect(searchValidation('AHWR-0000-1111')).toEqual({ searchText: 'AHWR-0000-1111', searchType: 'ref' })
  })

  test('Search validation - status', async () => {
    expect(searchValidation('agreed')).toEqual({ searchText: 'agreed', searchType: 'status' })
  })

  test('Search validation - sbi', async () => {
    expect(searchValidation('123456789')).toEqual({ searchText: '123456789', searchType: 'sbi' })
  })

  test('Search validation - organisation', async () => {
    expect(searchValidation("Mr John's Farm")).toEqual({ searchText: "Mr John's Farm", searchType: 'organisation' })
  })
})
