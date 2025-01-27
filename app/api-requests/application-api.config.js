import joi from 'joi'

export const applicationApiConfigSchema = joi.object({
  uri: joi.string().uri().default('http://host.docker.internal:3001/api')
})

const getApplicationApiConfig = () => {
  const config = {
    uri: process.env.APPLICATION_API_URI
  }

  const { error } = applicationApiConfigSchema.validate(config, {
    abortEarly: false
  })

  if (error) {
    throw new Error(`The config is invalid: ${error.message}`)
  }

  return config
}

export const applicationApiConfig = getApplicationApiConfig()
