const { statusIdToFrontendStatusMapping } = require('../../constants/status')

const isWithInLastTenMonths = require('../../api-requests/claim-api').isWithInLastTenMonths
const checkStatusTenMonths = (claimData) => {
    return claimData?.some((claim) =>isWithInLastTenMonths(claim?.data?.visitDate) &&
        (statusIdToFrontendStatusMapping[claim?.statusId] === 'PAID' || statusIdToFrontendStatusMapping[claim?.statusId] === 'READY TO PAY'))
    
}
module.exports = { checkStatusTenMonths }
