const { applicationDocumentsStorage } = require('../config/storage')
const getApplicationUrl = async (sbi, applicationReference) => {
  try {
    const blobName = `${sbi}/${applicationReference}.pdf`
    const applicationUrl = `/download-application/${applicationDocumentsStorage}/${blobName}`
    return applicationUrl
  } catch (error) {
    console.error('Error: application URL', error)
    return 'urlError'
  }
}

module.exports = getApplicationUrl
