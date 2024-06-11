const status = {
  AGREED: 1,
  WITHDRAWN: 2,
  IN_CHECK: 5,
  'IN CHECK': 5,
  ACCEPTED: 6,
  NOT_AGREED: 7,
  'NOT AGREED': 7,
  PAID: 8,
  READY_TO_PAY: 9,
  'READY TO PAY': 9,
  REJECTED: 10,
  ON_HOLD: 11,
  'ON HOLD': 11
}
const statusIdToFrontendStatusMapping = {
  2: 'WITHDRAWN', // withdrawn
  5: 'CLAIM SUBMITTED', // in check
  8: 'PAID', // paid
  9: 'CLAIM APPROVED', // ready to pay
  10: 'REJECTED', // rejected
  11: 'CLAIM SUBMITTED', // on hold
  12: 'CLAIM SUBMITTED', // recommended to pay
  13: 'CLAIM SUBMITTED', // recommended to reject
  15: 'CLAIM APPROVED', // sent to finance
  16: 'CLAIM APPROVED' // payment held
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
    styleClass: 'govuk-tag-- app-task-list__tag'
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
  'CLAIM SUBMITTED': {
    styleClass: 'govuk-tag--turquoise'
  },
  'CLAIM APPROVED': {
    styleClass: 'govuk-tag-- app-task-list__tag'
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

module.exports = { status, statusIdToFrontendStatusMapping, statusClass, claimStatus, closedStatuses }
