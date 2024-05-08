const { status } = require('../../constants/status')

const isWithInLastTenMonths = require('../../api-requests/claim-api').isWithInLastTenMonths

const checkReviewIsPaidOrReadyToPayAndWithinLastTenMonths = (claimData) => claimData?.some((claim) => ((isWithInLastTenMonths(claim?.data?.visitDate) || isWithInLastTenMonths(claim?.data?.dateOfVisit)) &&
            (claim?.statusId === status.PAID || claim?.statusId === status.READY_TO_PAY)) &&
            (claim?.type === 'VV' || claim?.type === 'R'))

module.exports = { checkReviewIsPaidOrReadyToPayAndWithinLastTenMonths }
