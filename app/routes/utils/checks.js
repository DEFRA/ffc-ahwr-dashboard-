const { status } = require('../../constants/status')
const { getObjectKeyByValue } = require('./get-object-key-by-value')

const isWithInLastTenMonths = require('../../api-requests/claim-api').isWithInLastTenMonths

/**
 * 
 * @param {*} claimData 
 * @returns 
 */
const checkStatusTenMonths = (claimData) =>{
    console.log('claimData ====>', claimData)
 return claimData?.some((claim) => ((isWithInLastTenMonths(claim?.data?.visitDate) || isWithInLastTenMonths(claim?.data?.dateOfVisit)) &&
            (getObjectKeyByValue(status, claim?.statusId) === 'PAID' || getObjectKeyByValue(status, claim?.statusId) === 'READY TO PAY')) &&
            ((claim?.type === 'VV' || claim?.data?.type === 'VV') || (claim?.type === 'R' || claim?.data?.type === 'R'))
        )

}

module.exports = { checkStatusTenMonths }
