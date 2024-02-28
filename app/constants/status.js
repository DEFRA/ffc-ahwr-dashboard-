const status = {
  AGREED: 1,
  WITHDRAWN: 2,
  IN_CHECK: 5,
  'IN CHECK': 5,
  ACCEPTED: 6,
  NOT_AGREED: 7,
  'NOT AGREED': 7,
  READY_TO_PAY: 9,
  'READY TO PAY': 9,
  REJECTED: 10,
  ON_HOLD: 11,
  'ON HOLD': 11
}
const statusId = {
  1: 'AGREED',
  2: 'WITHDRAWN',
  3: 'DATA INPUTTED',
  4: 'CLAIMED',
  5: 'IN CHECK',
  6: 'ACCEPTED',
  7: 'NOT AGREED',
  8: 'PAID',
  9: 'READY TO PAY',
  10: 'REJECTED',
  11: 'ON HOLD',
  12: 'Recommended to Pay',
  13: 'Recommended to Reject',
  14: 'AUTHORISED',
  15: 'SENT TO FINANCE',
  16: 'PAYMENT HELD'
}

const closedStatuses = [status.WITHDRAWN, status.REJECTED, status.NOT_AGREED, status.READY_TO_PAY]
const claimStatus = [status.IN_CHECK, status.REJECTED, status.READY_TO_PAY, status.ON_HOLD]

const statusClass = {
  APPLIED: {
    styleClass: 'govuk-tag--green'
  },
  AGREED: {
    styleClass: 'govuk-tag--green'
  },
  WITHDRAWN: {
    styleClass: 'govuk-tag--grey'
  },
  AUTHORISED: {
    styleClass: 'govuk-tag--grey'
  },
  PAID: {
    styleClass: 'govuk-tag--blue'
  },
  'Recommended to Pay': {
    styleClass: 'govuk-tag--blue'
  },
  'SENT TO FINANCE': {
    styleClass: 'govuk-tag--blue'
  },
  'DATA INPUTTED': {
    styleClass: 'govuk-tag--yellow'
  },
  REJECTED: {
    styleClass: 'govuk-tag--red'
  },
  'Recommended to Reject': {
    styleClass: 'govuk-tag--red'
  },
  'NOT AGREED': {
    styleClass: 'govuk-tag--pink'
  },
  ACCEPTED: {
    styleClass: 'govuk-tag--purple'
  },
  CLAIMED: {
    styleClass: 'govuk-tag--blue'
  },
  'IN CHECK': {
    styleClass: 'govuk-tag--orange'
  },
  'READY TO PAY': {
    styleClass: 'govuk-tag'
  },
  'ON HOLD': {
    styleClass: 'govuk-tag--grey'
  },
  'PAYMENT HELD': {
    styleClass: 'govuk-tag--grey'
  }
}

module.exports = { status, statusId, statusClass, claimStatus, closedStatuses }
