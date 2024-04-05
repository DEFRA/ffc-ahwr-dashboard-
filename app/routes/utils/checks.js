const { statusIdToFrontendStatusMapping } = require('../../constants/status')

const isWithInLastTenMonths = require('../../api-requests/claim-api').isWithInLastTenMonths
const checkStatusTenMonths = (claimData) => claimData?.some((claim) => isWithInLastTenMonths(claim?.createdAt) &&
        (statusIdToFrontendStatusMapping[claim?.statusId] === 'PAID' ||
        statusIdToFrontendStatusMapping[claim?.statusId] === 'READY TO PAY' ||
        statusIdToFrontendStatusMapping[claim?.statusId] === 'CLAIMED'))

module.exports = { checkStatusTenMonths }
