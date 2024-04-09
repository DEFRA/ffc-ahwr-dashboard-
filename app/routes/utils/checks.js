const { status } = require('../../constants/status')
const { getObjectKeyByValue } = require('./get-object-key-by-value')

const isWithInLastTenMonths = require('../../api-requests/claim-api').isWithInLastTenMonths

const checkStatusTenMonths = (claimData) => claimData?.some((claim) => ((isWithInLastTenMonths(claim?.data?.visitDate) || isWithInLastTenMonths(claim?.data?.dateOfVisit)) && 
            (getObjectKeyByValue(status, claim?.statusId) === 'PAID' || getObjectKeyByValue(status, claim?.statusId) === 'READY TO PAY')))
    
module.exports = { checkStatusTenMonths }
