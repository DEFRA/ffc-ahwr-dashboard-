const getFarmerApplication = require('./farmer-application')
const getOrganisationRows = require('./application-organisation')
const getClaimData = require('./application-claim')
const getHistoryData = require('./application-history')

const claimDataStatus = ['IN CHECK', 'REJECTED', 'READY TO PAY', 'ON HOLD']

function ViewModel (application, applicationHistory, applicationEvents) {
  this.model = {
    applicationData: getFarmerApplication(application),
    listData: { rows: getOrganisationRows(application?.data?.organisation) },
    claimData: application?.claimed || claimDataStatus.includes(application?.status?.status) ? getClaimData(application, applicationEvents) : false,
    historyData: getHistoryData(applicationHistory),
  }
}

module.exports = ViewModel
