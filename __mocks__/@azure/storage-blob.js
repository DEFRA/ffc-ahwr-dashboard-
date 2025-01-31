const { Readable } = require('node:stream')

class BlobClient {
  constructor (file) {
    this.file = file
  }
  
  download () {
    const pdf = Buffer.from(this.file, 'ascii')
    const stream = new Readable()
    stream.push(pdf)
    stream.push(null)
    return { readableStreamBody: stream }
  }
}

class Container {
  getBlobClient (file) {
    return new BlobClient(file)
  }
}

class BlobServiceClient {
  getContainerClient () {
    return new Container()
  }

  static fromConnectionString () {}
}

BlobServiceClient.fromConnectionString = jest.fn()
  .mockImplementation(() => {
    return new BlobServiceClient()
  })

module.exports = { BlobServiceClient }
