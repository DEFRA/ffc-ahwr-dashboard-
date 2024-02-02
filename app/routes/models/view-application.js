const getFarmerApplication = require('./farmer-application')
const getEndemicsClaim = require('./application-claim')
const getOrganisationRows = require('./application-organisation')

const claimDataStatus = ['IN CHECK', 'REJECTED', 'READY TO PAY', 'ON HOLD']

function ViewModel (application, applicationEvents) {
  this.model = {
    applicationData: getFarmerApplication(application, applicationEvents),
    claimData: application?.claimed || claimDataStatus.includes(application?.status?.status) ? getEndemicsClaim(application, applicationEvents) : false,
    listData: { rows: getOrganisationRows(application?.data?.organisation) }
  }
}

module.exports = ViewModel
