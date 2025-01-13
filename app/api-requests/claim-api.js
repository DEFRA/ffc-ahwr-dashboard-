const wreck = require('@hapi/wreck')
const config = require('../config')

async function getClaimsByApplicationReference (applicationReference, logger) {
  const endpoint = `${config.applicationApiUri}/claim/get-by-application-reference/${applicationReference}`
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

function isWithinLastTenMonths (date) {
  if (!date) {
    return false // Date of visit was introduced more than 10 months ago
  }

  const start = new Date(date)
  const end = new Date(start)

  end.setMonth(end.getMonth() + 10)
  end.setHours(23, 59, 59, 999) // set to midnight of the agreement end day

  return Date.now() <= end
}

module.exports = {
  isWithinLastTenMonths,
  getClaimsByApplicationReference
}
