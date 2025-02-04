const { userNeedsNotification } = require('../../../../../app/routes/utils/user-needs-notification')
const { multiSpecies } = require('../../../../../app/config/index')

jest.mock('../../../../../app/config/index')

test('no applications', () => {
  const applications = []
  const claims = []

  const result = userNeedsNotification(applications, claims)

  expect(result).toBe(false)
})

test('applied before, no claims', () => {
  jest.replaceProperty(multiSpecies, 'releaseDate', '2024-12-04')

  const applications = [{ createdAt: '2024-12-03' }]
  const claims = []

  const result = userNeedsNotification(applications, claims)

  expect(result).toBe(true)
})

test('applied before, claimed before', () => {
  jest.replaceProperty(multiSpecies, 'releaseDate', '2024-12-04')

  const applications = [{ createdAt: '2024-12-03' }]
  const claims = [{ createdAt: '2024-12-03' }]

  const result = userNeedsNotification(applications, claims)

  expect(result).toBe(true)
})

test('applied before, claimed after', () => {
  jest.replaceProperty(multiSpecies, 'releaseDate', '2024-12-04')

  const applications = [{ createdAt: '2024-12-03' }]
  const claims = [{ createdAt: '2024-12-05' }]

  const result = userNeedsNotification(applications, claims)

  expect(result).toBe(false)
})

test('applied after', () => {
  jest.replaceProperty(multiSpecies, 'releaseDate', '2024-12-04')

  const applications = [{ createdAt: '2024-12-05' }]
  const claims = []

  const result = userNeedsNotification(applications, claims)

  expect(result).toBe(false)
})
