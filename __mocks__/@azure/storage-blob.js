const { Readable } = require('node:stream')

class BlobClient {
  download () {
    const pdf = Buffer.from('test pdf', 'ascii')
    const stream = new Readable()
    stream.push(pdf)
    stream.push(null)
    return { readableStreamBody: stream }
  }
}

class Container {
  getBlobClient () {
    return new BlobClient()
  }
}

class BlobServiceClient {
  getContainerClient () {
    return new Container()
  }

  static fromConnectionString () {
    return new BlobServiceClient()
  }
}

module.exports = { BlobServiceClient }
