const wreck = require('@hapi/wreck')
const appInsights = require('applicationinsights')
const config = require('../config')
const { getOrganisationAddress, getPersonName } = require('./rpa-api/index')

async function updateContactHistory (data, logger) {
  const endpoint = `${config.applicationApiUri}/application/contact-history`
  try {
    const { payload } = await wreck.put(endpoint, {
      payload: data,
      json: true
    })

    return payload
  } catch (err) {
    if (err.output.statusCode === 404) {
      return []
    }
    logger.setBindings({ err, endpoint })
    appInsights.defaultClient.trackException({ exception: err })
    throw err
  }
}

const changeContactHistory = async (personSummary, organisationSummary, logger) => {
  const currentAddress = getOrganisationAddress(organisationSummary.address)
  await updateContactHistory({
    farmerName: getPersonName(personSummary),
    orgEmail: organisationSummary.email,
    email: personSummary.email ? personSummary.email : organisationSummary.email,
    sbi: organisationSummary.sbi,
    address: currentAddress,
    user: 'admin'
  }, logger)
}

module.exports = {
  changeContactHistory,
  updateContactHistory
}
