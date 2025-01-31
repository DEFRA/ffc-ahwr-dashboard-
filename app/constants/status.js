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

const closedStatuses = [
  status.WITHDRAWN,
  status.REJECTED,
  status.NOT_AGREED,
  status.READY_TO_PAY
]

module.exports = { status, closedStatuses }
