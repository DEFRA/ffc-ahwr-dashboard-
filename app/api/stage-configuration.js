const Wreck = require('@hapi/wreck')
const { applicationApiUri } = require('../config')
const HttpStatus = require('http-status-codes')

async function getAllStageConfigurations () {
  const url = `${applicationApiUri}/stageconfiguration`
  try {
    const response = await Wreck.get(url, { json: true })
    if (response.res.statusCode !== HttpStatus.StatusCodes.OK) {
      throw new Error(`HTTP ${response.res.statusCode} (${response.res.statusMessage})`)
    }
    console.log(`Application API: Got all stage configurations: ${JSON.stringify(response.payload)}`)
    return response.payload
  } catch (err) {
    console.log(`Application API: Error while getting all stage configurations: ${err.message}`)
    console.error(err)
    return []
  }
}

async function getStageConfigurationById (id) {
  const url = `${applicationApiUri}/stageconfiguration/${id}`
  console.log(`Application API: Getting stage configurations by id ${id}`)
  try {
    const response = await Wreck.get(url, { json: true })
    if (response.res.statusCode !== HttpStatus.StatusCodes.OK) {
      throw new Error(`HTTP ${response.res.statusCode} (${response.res.statusMessage})`)
    }
    return response.payload
  } catch (err) {
    console.log(`Application API: Error while getting stage configuration by id: ${err.message}`)
    console.error(err)
    return []
  }
}

module.exports = {
  getAllStageConfigurations,
  getStageConfigurationById
}
