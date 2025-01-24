const { BlobServiceClient } = require('@azure/storage-blob')
const { DefaultAzureCredential } = require('@azure/identity')
const { storage } = require('./config')
const { streamToBuffer } = require('./lib/streamToBuffer')

const {
  applicationDocumentsContainer
} = storage

let blobServiceClient
function initialiseClient () {
  if (!blobServiceClient) {
    const {
      connectionString,
      useConnectionString,
      storageAccount
    } = storage

    if (useConnectionString === true) {
      blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
    } else {
      const uri = `https://${storageAccount}.blob.core.windows.net`
      blobServiceClient = new BlobServiceClient(uri, new DefaultAzureCredential({ managedIdentityClientId: process.env.AZURE_CLIENT_ID }))
    }
  }
}

function resetClient () {
  blobServiceClient = undefined
}

const getBlob = async (filename) => {
  initialiseClient()

  const container = blobServiceClient.getContainerClient(applicationDocumentsContainer)
  const blobClient = container.getBlobClient(filename)
  const downloadResponse = await blobClient.download()
  return await streamToBuffer(downloadResponse.readableStreamBody)
}

module.exports = {
  getBlob,
  resetClient
}
