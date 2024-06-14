const { status } = require('../../constants/status')

const checkReviewIsPaidOrReadyToPay = (claimData) => claimData?.some((claim) =>
  (
    (claim?.statusId === status.PAID || claim?.statusId === status.READY_TO_PAY) &&
    (claim?.type === 'VV' || claim?.type === 'R')
  ))

module.exports = { checkReviewIsPaidOrReadyToPay }
