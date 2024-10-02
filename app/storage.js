const { BlobServiceClient } = require('@azure/storage-blob')
const { DefaultAzureCredential } = require('@azure/identity')
const { connectionString, useConnectionString, applicationDocumentsContainer, storageAccount } = require('./config').storage
const { streamToBuffer } = require('./lib/streamToBuffer')
let blobServiceClient

if (useConnectionString === true) {
  blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
} else {
  const uri = `https://${storageAccount}.blob.core.windows.net`
  blobServiceClient = new BlobServiceClient(uri, new DefaultAzureCredential())
}

const getBlob = async (filename) => {
  try {
    const container = blobServiceClient.getContainerClient(applicationDocumentsContainer)
    const blobClient = container.getBlobClient(filename)
    const downloadResponse = await blobClient.download()
    const downloaded = await streamToBuffer(downloadResponse.readableStreamBody)
    return downloaded
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

module.exports = {
  getBlob
}
