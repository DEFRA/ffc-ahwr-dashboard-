const { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } = require('@azure/storage-blob')
const { connectionString, accountName, accountKey, applicationDocumentsStorage } = require('../config/storage')
const containerName = applicationDocumentsStorage

const getApplicationUrl = async (sbi, reference) => {
  try {
    const blobName = `${sbi}/${reference}.pdf`
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
    const containerClient = blobServiceClient.getContainerClient(containerName)
    const blobClient = containerClient.getBlobClient(blobName)

    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey)
    const sasToken = generateBlobSASQueryParameters({
        containerName,
        blobName,
        permissions: BlobSASPermissions.parse('r'),
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + 3600 * 1000 * 2), // 1 hour
      }, sharedKeyCredential).toString()

    const applicationUrl = `${blobClient.url}?${sasToken}`

    return applicationUrl
  } catch (error) {
    console.error('Error: application URL', error)
    // throw error
    return 'urlError'
  }
}

module.exports = getApplicationUrl