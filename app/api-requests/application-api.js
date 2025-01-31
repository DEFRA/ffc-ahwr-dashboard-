const wreck = require('@hapi/wreck')
const config = require('../config')

async function getLatestApplicationsBySbi (sbi, logger) {
  const endpoint = `${config.applicationApi.uri}/applications/latest?sbi=${sbi}`
  try {
    const { payload } = await wreck.get(
      endpoint,
      { json: true }
    )

    return payload
  } catch (err) {
    logger.setBindings({ err })
    throw err
  }
}

module.exports = {
  getLatestApplicationsBySbi
}
