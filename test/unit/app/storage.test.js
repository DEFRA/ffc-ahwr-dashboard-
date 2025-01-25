const { BlobServiceClient } = require('@azure/storage-blob')
const { getBlob } = require('../../../app/storage')
const { storage } = require('../../../app/config')

describe('Blob Storage Service', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should initialize client with connection string and return buffer content', async () => {
    storage.connectionString = 'fakeConnectionString'
    storage.useConnectionString = true

    const blobContent = await getBlob('fakeFile.txt')

    expect(BlobServiceClient.fromConnectionString).toHaveBeenCalledWith('fakeConnectionString')
    expect(Buffer.from(blobContent).toString()).toEqual('fakeFile.txt')
  })

  it('should initialize client with managed identity', async () => {
    storage.useConnectionString = false
    const blobContent = await getBlob('fakeFile.txt')

    expect(BlobServiceClient.fromConnectionString).toHaveBeenCalledTimes(0)
    expect(Buffer.from(blobContent).toString()).toEqual('fakeFile.txt')
  })
})
