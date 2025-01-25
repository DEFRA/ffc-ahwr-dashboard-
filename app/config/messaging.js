const Joi = require('joi')

const mqSchema = Joi.object({
  messageQueue: {
    host: Joi.string().required(),
    username: Joi.string(),
    password: Joi.string(),
    useCredentialChain: Joi.bool().required(),
    managedIdentityClientId: Joi.string().optional(),
    appInsights: Joi.object()
  },
  eventQueue: {
    address: process.env.EVENT_QUEUE_ADDRESS,
    type: 'queue'
  }
})

const mqConfig = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    useCredentialChain: process.env.NODE_ENV === 'production',
    managedIdentityClientId: process.env.AZURE_CLIENT_ID,
    appInsights: process.env.NODE_ENV === 'production' ? require('applicationinsights') : undefined
  },
  eventQueue: {
    address: process.env.EVENT_QUEUE_ADDRESS,
    type: 'queue'
  }
}

const mqResult = mqSchema.validate(mqConfig, {
  abortEarly: false
})

if (mqResult.error) {
  throw new Error(`The message queue config is invalid. ${mqResult.error.message}`)
}

const eventQueue = { ...mqResult.value.messageQueue, ...mqResult.value.eventQueue }

module.exports = {
  eventQueue
}
