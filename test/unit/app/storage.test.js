const { BlobServiceClient } = require('@azure/storage-blob')
const { getBlob, resetClient } = require('../../../app/storage')
const { streamToBuffer } = require('../../../app/lib/streamToBuffer')
const { storage } = require('../../../app/config')

jest.mock('@azure/storage-blob')
jest.mock('@azure/identity')
jest.mock('../../../app/lib/streamToBuffer')

const mockFromConnectionString = jest.fn(() => ({
  getContainerClient: jest.fn(() => ({
    getBlobClient: jest.fn(() => ({
      download: jest.fn(() => ({
        readableStreamBody: 'fakeStream'
      }))
    }))
  }))
}))
BlobServiceClient.fromConnectionString = mockFromConnectionString

describe('Blob Storage Service', () => {
  beforeEach(() => {
    streamToBuffer.mockResolvedValue('fakeBufferContent')
  })

  afterEach(() => {
    resetClient()
    jest.resetAllMocks()
    jest.resetModules()
  })

  it('should initialize client with connection string and return buffer content', async () => {
    storage.connectionString = 'fakeConnectionString'
    storage.useConnectionString = true

    const blobContent = await getBlob('fakeFile.txt')

    expect(BlobServiceClient.fromConnectionString).toHaveBeenCalledWith('fakeConnectionString')
    expect(blobContent).toEqual('fakeBufferContent')
  })

  it('should initialize client with managed identity', async () => {
    storage.useConnectionString = false
    storage.applicationDocumentsContainer = 'fakeContainer'
    storage.storageAccount = 'fakeAccount'

    process.env.AZURE_CLIENT_ID = 'fakeClientId'

    const blobContent = await getBlob('fakeFile.txt')

    expect(BlobServiceClient.fromConnectionString).toHaveBeenCalledTimes(0)

    expect(blobContent).toEqual('fakeBufferContent')
  })
})
