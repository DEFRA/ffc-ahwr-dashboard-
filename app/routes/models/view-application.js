const getFarmerApplication = require('./farmer-application')
const getOrganisationRows = require('./application-organisation')

function ViewModel (application) {
  this.model = {
    applicationData: getFarmerApplication(application),
    listData: { rows: getOrganisationRows(application?.data?.organisation) }
  }
}

module.exports = ViewModel
