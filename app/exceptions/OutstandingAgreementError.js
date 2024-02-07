class OutstandingAgreementError extends Error {
  constructor (message) {
    super(message)
    this.name = 'OutstandingAgreementError'
  }
}

module.exports = OutstandingAgreementError
