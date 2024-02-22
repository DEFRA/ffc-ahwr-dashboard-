const mockPerson = require('../../../../../app/api-requests/rpa-api/person')
const mockOrganisation = require('../../../../../app/api-requests/rpa-api/organisation')
const index = require('../../../../../app/api-requests/rpa-api/index')
jest.mock('../../../../../app/api-requests/rpa-api/person')
jest.mock('../../../../../app/api-requests/rpa-api/organisation')
const id = 1234567
const sbi = 106979907
describe('Index', () => {
  test('when getPersonSummary called - returns valid payload', async () => {
    mockPerson.getPersonSummary.mockResolvedValueOnce({
      firstName: 'Bill',
      middleName: 'James',
      lastName: 'Smith',
      email: 'billsmith@testemail.com',
      id,
      customerReferenceNumber: '1103452436'
    })

    const result = await index.getPersonSummary()

    expect(mockPerson.getPersonSummary).toHaveBeenCalledTimes(1)
    expect(result.firstName).toMatch('Bill')
    expect(result.middleName).toMatch('James')
    expect(result.lastName).toMatch('Smith')
    expect(result.email).toMatch('billsmith@testemail.com')
    expect(result.id).toEqual(id)
    expect(result.customerReferenceNumber).toMatch('1103452436')
  })

  test('when getPersonName called - returns valid payload', async () => {
    const name = 'Bill James Smith'
    mockPerson.getPersonName.mockResolvedValueOnce(name)

    const result = await index.getPersonName()

    expect(mockPerson.getPersonName).toHaveBeenCalledTimes(1)
    expect(result).toMatch(name)
  })

  test('when organisationIsEligible called - returns valid payload', async () => {
    mockOrganisation.organisationIsEligible.mockResolvedValueOnce({
      organisationPermission: true,
      organisation: {
        id,
        name: 'Mrs Jane Black',
        sbi,
        address: {
          address1: '1 Test House',
          address2: 'Test Road',
          address3: '',
          address4: null,
          address5: null,
          pafOrganisationName: null,
          flatName: null,
          buildingNumberRange: '1',
          buildingName: 'TEST HOUSE',
          street: 'TEST ROAD',
          city: 'Test City',
          county: 'Test County',
          postalCode: 'TS1 1TS',
          country: 'Test Country',
          uprn: '',
          dependentLocality: '',
          doubleDependentLocality: null,
          addressTypeId: null
        },
        email: null,
        businessReference: '1100165525'
      }
    })

    const result = await index.organisationIsEligible()

    expect(mockOrganisation.organisationIsEligible).toHaveBeenCalledTimes(1)
    expect(result.organisationPermission).toBeTruthy()
    expect(result.organisation.id).toEqual(id)
    expect(result.organisation.name).toMatch('Mrs Jane Black')
    expect(result.organisation.sbi).toEqual(sbi)
    expect(result.organisation.address.address1).toMatch('1 Test House')
    expect(result.organisation.address.city).toMatch('Test City')
    expect(result.organisation.address.county).toMatch('Test County')
    expect(result.organisation.address.postalCode).toMatch('TS1 1TS')
  })
})
