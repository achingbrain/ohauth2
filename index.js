'use strict'

const defaults = require('lodash.defaultsdeep')
const AccessToken = require('./lib/access-token')

module.exports = (config) => {
  config = defaults(config, {
    client_id: 5,
    client_secret: 'shh!',
    scope: 'all',
    token_url: 'https://example.com/oauth/access_token',
    auth_url: 'https://example.com/oauth/authorize',
    revoke_url: 'https://example.com/oauth/revoke',
    wreck: {
      // any options here will be passed to wreck with every request
      json: true
    }
  })

  return {
    createAccessToken: (token) => {
      return new AccessToken(config, token)
    }
  }
}
