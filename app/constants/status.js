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
  PAID: {
    styleClass: 'govuk-tag--blue'
  },
  DATAINPUTTED: {
    styleClass: 'govuk-tag--yellow'
  },
  REJECTED: {
    styleClass: 'govuk-tag--red'
  },
  NOTAGREED: {
    styleClass: 'govuk-tag--pink'
  },
  ACCEPTED: {
    styleClass: 'govuk-tag--purple'
  },
  CHECK: {
    styleClass: 'govuk-tag--orange'
  },
  CLAIMED: {
    styleClass: 'govuk-tag--blue'
  },
  INCHECK: {
    styleClass: 'govuk-tag--orange'
  },
  READYTOPAY: {
    styleClass: 'govuk-tag'
  }
}

const getStyleClassByStatus = (value) => {
  value = value.replace(/\s/g, '')
  const v = Object.keys(statusClass).map(i => i === value)
  if (v.filter(s => s === true).length > 0) {
    return statusClass[value].styleClass
  } else { return 'govuk-tag--grey' }
}

module.exports = { status, claimStatus, closedStatuses, getStyleClassByStatus }
