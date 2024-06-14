const session = require('../../session')
const auth = require('../../auth')
const { confirmCheckDetails } = require('../../session/keys').endemicsClaim
const { getYesNoRadios } = require('./form-component/yes-no-radios')

const labelText = 'Are these details correct?'

const formatAddressForDisplay = (organisation) => {
  return organisation?.address?.replaceAll(',', '<br>')
}

const getOrganisation = (request, organisation, errorText) => {
  const prevAnswer = session.getEndemicsClaim(request, confirmCheckDetails)
  const { crn } = session.getCustomer(request)

  const rows = [
    { key: { text: 'Farmer name' }, value: { text: organisation.farmerName } },
    { key: { text: 'Business name' }, value: { text: organisation.name } },
    { key: { text: 'CRN number' }, value: { text: crn } },
    { key: { text: 'SBI number' }, value: { text: organisation.sbi } },
    { key: { text: 'Organisation email address' }, value: { text: organisation.orgEmail } },
    { key: { text: 'User email address' }, value: { text: organisation.email } },
    {
      key: { text: 'Address' },
      value: { html: formatAddressForDisplay(organisation) }
    }
  ]
  return {
    backLink: {
      href: auth.requestAuthorizationCodeUrl(session, request)
    },
    organisation,
    listData: { rows },
    ...getYesNoRadios(labelText, confirmCheckDetails, prevAnswer, errorText, {
      isPageHeading: false,
      legendClasses: 'govuk-fieldset__legend--m',
      inline: true
    })
  }
}

module.exports = getOrganisation
