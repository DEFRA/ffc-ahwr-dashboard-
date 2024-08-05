const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  connectionString: Joi.string().required(),
  accountName: Joi.string().required(),
  accountKey: Joi.string().required(),
  applicationDocumentsStorage: Joi.string().default('documents')
})

// Build config
const storageConfig = {
  connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY,
  applicationDocumentsStorage: process.env.AZURE_STORAGE_APPLICATION_DOCUMENTS
}

// Validate config
const storageResult = schema.validate(storageConfig, {
  abortEarly: false
})

// Throw if config is invalid
if (storageResult.error) {
  throw new Error(`The blob storage config is invalid. ${storageResult.error.message}`)
}

module.exports = storageResult.value
