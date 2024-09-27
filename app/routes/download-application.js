const { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } = require('@azure/storage-blob')
const { accountName, accountKey, applicationDocumentsStorage } = require('../config/storage')

module.exports = {
  method: 'GET',
  path: '/download-application/{containerName}/{blobName}',
  handler: async (request, h) => {
    const { sbi, reference } = request.params

    try {
      const containerName = applicationDocumentsStorage
      const blobName = `${sbi}/${reference}.pdf`

      const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey)
      const sasToken = generateBlobSASQueryParameters({
        containerName,
        blobName,
        permissions: BlobSASPermissions.parse('r'),
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + 3600 * 1000 * 2) // 2 hour (allows for time differences as a test, this timespan probably needs to be shortened)
      }, sharedKeyCredential).toString()

      const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net?${sasToken}`)

      const containerClient = blobServiceClient.getContainerClient(containerName)

      const blobClient = containerClient.getBlobClient(blobName)

      const downloadBlockBlobResponse = await blobClient.download()

      const readableStream = downloadBlockBlobResponse.readableStreamBody

      return h.response(readableStream)
        .header('Content-Disposition', `attachment; filename='${blobName}'`)
        .type('application/pdf')
    } catch (error) {
      console.error('Error downloading file:', error)
      return h.response('Error downloading file').code(500)
    }
  }
}
