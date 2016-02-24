'use strict'

const nodeify = require('nodeify')
const wreck = require('wreck')
const qs = require('qs')

class AccessToken {

  constructor(config, token) {
    Object.defineProperty(this, 'config', {
      value: config
    })

    this._parse(token)
  }

  _parse(token) {
    this.access_token = token.access_token
    this.refresh_token = token.refresh_token
    this.expires_in = token.expires_in
    this.expires_at = token.expires_at || Date.now() + (token.expires_in * 1000)
  }

  get expired() {
    return Date.now() > this.expires_at
  }

  refresh(callback) {
    const p = new Promise((resolve, reject) => {
      const payload = {
        grant_type: 'refresh_token',
        refresh_token: this.refresh_token,
        scope: this.config.scope,
        client_id: this.config.client_id,
        client_secret: this.config.client_secret
      }

      const options = JSON.parse(JSON.stringify(this.config.wreck))
      options.payload = qs.stringify(payload)
      options.headers = options.headers || {}
      options.headers['content-type'] = 'application/x-www-form-urlencoded'

      wreck.post(this.config.token_url, options, (error, response, payload) => {
        if (error) {
          return reject(error)
        }

        if (response.statusCode !== 200) {
          return reject(new Error('Trying to refresh the access_token returned ' + response.statusCode + ': ' + response.statusMessage))
        }

        this._parse(payload)

        resolve(this)
      })
    })

    return nodeify(p, callback)
  }

  revoke(callback) {

  }
}

module.exports = AccessToken
