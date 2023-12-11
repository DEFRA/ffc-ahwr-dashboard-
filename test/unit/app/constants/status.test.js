const { getStyleClassByStatus } = require('../../../../app/constants/status')

describe('Constants - Status tests', () => {
  test('getStyleClassByStatus - empty string', async () => {
    expect(getStyleClassByStatus('')).toEqual('govuk-tag--grey')
  })

  test('getStyleClassByStatus - APPLIED', async () => {
    expect(getStyleClassByStatus('APPLIED')).toEqual('govuk-tag--green')
  })

  test('getStyleClassByStatus - AGREED', async () => {
    expect(getStyleClassByStatus('AGREED')).toEqual('govuk-tag--green')
  })

  test('getStyleClassByStatus - WITHDRAWN', async () => {
    expect(getStyleClassByStatus('WITHDRAWN')).toEqual('govuk-tag--grey')
  })

  test('getStyleClassByStatus - PAID', async () => {
    expect(getStyleClassByStatus('PAID')).toEqual('govuk-tag--blue')
  })

  test('getStyleClassByStatus - DATAINPUTTED', async () => {
    expect(getStyleClassByStatus('DATAINPUTTED')).toEqual('govuk-tag--yellow')
  })

  test('getStyleClassByStatus - REJECTED', async () => {
    expect(getStyleClassByStatus('REJECTED')).toEqual('govuk-tag--red')
  })

  test('getStyleClassByStatus - NOTAGREED', async () => {
    expect(getStyleClassByStatus('NOTAGREED')).toEqual('govuk-tag--pink')
  })

  test('getStyleClassByStatus - ACCEPTED', async () => {
    expect(getStyleClassByStatus('ACCEPTED')).toEqual('govuk-tag--purple')
  })

  test('getStyleClassByStatus - CHECK', async () => {
    expect(getStyleClassByStatus('CHECK')).toEqual('govuk-tag--orange')
  })

  test('getStyleClassByStatus - CLAIMED', async () => {
    expect(getStyleClassByStatus('CLAIMED')).toEqual('govuk-tag--blue')
  })

  test('getStyleClassByStatus - INCHECK', async () => {
    expect(getStyleClassByStatus('INCHECK')).toEqual('govuk-tag--orange')
  })

  test('getStyleClassByStatus - READYTOPAY', async () => {
    expect(getStyleClassByStatus('READYTOPAY')).toEqual('govuk-tag')
  })
})
