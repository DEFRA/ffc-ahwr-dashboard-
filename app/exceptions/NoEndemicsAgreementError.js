class NoEndemicsAgreementError extends Error {
  constructor (message) {
    super(message)
    this.name = 'NoEndemicsAgreementError'
  }
}

module.exports = NoEndemicsAgreementError
