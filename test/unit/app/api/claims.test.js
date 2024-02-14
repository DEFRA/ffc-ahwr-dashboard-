jest.mock('@hapi/wreck', () => ({
  get: jest.fn(),
  post: jest.fn()
}))

jest.mock('../../../../app/config', () => ({
  ...jest.requireActual('../../../../app/config'),
  applicationApiUri: 'https://example.com/api'
}))

jest.mock('../../../../app/constants/status', () => ({
  status: { APPROVED: 1, REJECTED: 2 },
  claimStatus: [1]
}))

const HttpStatus = require('http-status-codes')
const { getClaim, getClaims } = require('../../../../app/api/claims')
const Wreck = require('@hapi/wreck')
describe('getClaim function', () => {
  it('should return claim data on successful response', async () => {
    const mockClaimData = { id: '123', statusId: 1 }
    Wreck.get.mockResolvedValue({
      res: { statusCode: HttpStatus.StatusCodes.OK },
      payload: mockClaimData
    })

    const result = await getClaim('123')
    expect(result).toEqual(mockClaimData)
  })

  it('should return null on non-OK response', async () => {
    Wreck.get.mockResolvedValue({
      res: { statusCode: HttpStatus.StatusCodes.NOT_FOUND },
      payload: {}
    })

    const result = await getClaim('nonexistent')
    expect(result).toBeNull()
  })
})
describe('getClaims function', () => {
  it('should return filtered claims on successful response', async () => {
    const mockResponsePayload = {
      applications: [
        { id: '1', statusId: 1 },
        { id: '2', statusId: 2 }
      ],
      applicationStatus: [
        { status: 'APPROVED', count: 1 },
        { status: 'REJECTED', count: 1 }
      ]
    }
    Wreck.post.mockResolvedValue({
      res: { statusCode: HttpStatus.StatusCodes.OK },
      payload: mockResponsePayload
    })

    const { claims, total, claimStatus } = await getClaims('status', 'APPROVED', 10, 0, [1], 'asc')

    expect(claims).toHaveLength(1) // Only 1 claim matches the claimStatus filter
    expect(total).toEqual(1)
    expect(claimStatus).toHaveLength(1)
    expect(claimStatus[0].status).toEqual('APPROVED')
  })

  it('should return empty arrays and zero total on non-OK response', async () => {
    Wreck.post.mockResolvedValue({
      res: { statusCode: HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR },
      payload: {}
    })

    const result = await getClaims('status', 'FAILED', 10, 0, [], 'asc')
    expect(result).toEqual({ claims: [], total: 0, claimStatus: [] })
  })
})
