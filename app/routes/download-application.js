const boom = require('@hapi/boom')
const { getBlob } = require('../storage')
const session = require('../session')

module.exports = {
  method: 'GET',
  path: '/download-application/{sbi}/{reference}',
  handler: async (request, h) => {
    const { sbi, reference } = request.params
    const { LatestEndemicsApplicationReference, organisation } = session.getEndemicsClaim(request)
    const blobName = `${sbi}/${reference}.pdf`
    if (LatestEndemicsApplicationReference === reference && organisation.sbi === sbi) {
      const blobBuffer = await getBlob(blobName)
      return h.response(blobBuffer)
        .type('application/pdf')
        .header('Content-type', 'application/pdf')
        .header('Content-length', blobBuffer.length)
    }
    return boom.notFound()
  }
}
