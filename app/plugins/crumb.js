const config = require('../config')

module.exports = {
  plugin: require('@hapi/crumb'),
  options: {
    cookieOptions: {
      isSecure: config.cookie.isSecure
    },
    skip: (request) => request.route.path === '/cookies' && request.method.toLowerCase() === 'post' // Exclude from crumb token changes
  }
}
