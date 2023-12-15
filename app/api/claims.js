const Wreck = require('@hapi/wreck')
const { applicationApiUri } = require('../config')
const { status, claimStatus } = require('../constants/status')

async function getClaim (reference) {
  const url = `${applicationApiUri}/application/get/${reference}`
  try {
    const response = await Wreck.get(url, { json: true })
    if (response.res.statusCode !== 200) {
      return null
    }

    return response.payload
  } catch (err) {
    console.log(err)
    return null
  }
}

async function getClaims (searchType, searchText, limit, offset, filterStatus, sort) {
  const url = `${applicationApiUri}/application/search`
  const options = {
    payload: {
      search: { text: searchText, type: searchType },
      limit,
      offset,
      filter: filterStatus,
      sort
    },
    json: true
  }
  try {
    const response = await Wreck.post(url, options)
    if (response.res.statusCode !== 200) {
      return { claims: [], total: 0, claimStatus: [] }
    }

    const claims = response.payload.applications.filter((app) => claimStatus.includes(app.statusId))
    const claimStatusCount = response.payload.applicationStatus.filter((app) => claimStatus.includes(status[`${app.status}`]))

    return { claims, total: claims.length, claimStatus: claimStatusCount }
  } catch (err) {
    console.log(err)
    return { claims: [], total: 0, claimStatus: [] }
  }
}

module.exports = {
  getClaims,
  getClaim
}
