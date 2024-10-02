const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  connectionString: Joi.string().required(),
  applicationDocumentsContainer: Joi.string().default('documents'),
  useConnectionString: Joi.bool().default(true),
  storageAccount: Joi.string().required()
})

// Build config
const storageConfig = {
  connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  useConnectionString: process.env.AZURE_STORAGE_USE_CONNECTION_STRING,
  applicationDocumentsContainer: process.env.AZURE_STORAGE_APPLICATION_CONTAINER,
  storageAccount: process.env.AZURE_STORAGE_ACCOUNT_NAME
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
