describe('storage tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

  describe('Download blob', () => {
    describe('getBlob', () => {
      test('should return Buffer data from downloaded blob', async () => {
        const mockDownloadResponse = {
          readableStreamBody: {
            on: jest.fn(),
            read: jest.fn(),
            once: jest.fn(),
            pause: jest.fn(),
            resume: jest.fn(),
            isPaused: jest.fn(),
            pipe: jest.fn(),
            unpipe: jest.fn(),
            unshift: jest.fn(),
            wrap: jest.fn(),
            [Symbol.asyncIterator]: jest.fn()
          }
        }
        const mockBuffer = {
          type: 'Buffer',
          data: [
            123,
            34,
            107,
            101,
            121,
            34,
            58,
            34,
            118,
            97,
            108,
            117,
            101,
            34,
            125
          ]
        }
        const mockStreamToBuffer = jest.fn().mockResolvedValue(mockBuffer)
        const mockDownload = jest.fn()
        const mockBlobClient = jest.fn()
        jest.mock('../../../app/lib/streamToBuffer', () => ({
          streamToBuffer: mockStreamToBuffer
        }))
        const mockGetContainerClient = jest.fn().mockReturnValueOnce({
          getBlobClient: mockBlobClient.mockReturnValueOnce({
            download: mockDownload.mockResolvedValue(mockDownloadResponse)
          })
        })
        const { BlobServiceClient } = require('@azure/storage-blob')
        jest.mock('@azure/storage-blob')
        BlobServiceClient.mockImplementation(() => ({
          getContainerClient: mockGetContainerClient
        }))
        const { getBlob } = require('../../../app/storage')
        const result = await getBlob('filename.json')
        expect(mockGetContainerClient).toHaveBeenCalledTimes(1)
        expect(mockBlobClient).toHaveBeenCalledTimes(1)
        expect(mockDownload).toHaveBeenCalledTimes(1)
        expect(mockStreamToBuffer).toHaveBeenCalledTimes(1)
        expect(result).toEqual(mockBuffer)
      })
    })

    describe('create blob client', () => {
      test('create blob client with connectionStringEnabled', async () => {
        jest.mock('../../../app/config', () => ({
          storage: {
            storageAccount: 'mockStorageAccount',
            useConnectionString: true,
            applicationDocumentsStorage: 'documents',
            connectionString: 'connectionString'
          }
        }))
        const { BlobServiceClient } = require('@azure/storage-blob')
        const mockFromConnectionString = jest.fn()
        jest.mock('@azure/storage-blob')
        BlobServiceClient.fromConnectionString = mockFromConnectionString

        require('../../../app/storage')
        expect(mockFromConnectionString).toHaveBeenCalledTimes(1)
        jest.clearAllMocks()
        jest.resetModules()
      })
    })
  })
})
