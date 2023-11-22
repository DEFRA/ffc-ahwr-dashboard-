const session = require('../../session')
const auth = require('../../auth')

const formatAddressForDisplay = (organisation) => {
  return organisation?.address?.replaceAll(',', '<br>')
}

const getOrganisation = (request, organisation, errorText) => {
  const rows = [
    { key: { text: 'Farmer name' }, value: { text: organisation.farmerName } },
    { key: { text: 'Business name' }, value: { text: organisation.name } },
    { key: { text: 'SBI number' }, value: { text: organisation.sbi } },
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
    listData: { rows }
  }
}

module.exports = getOrganisation
