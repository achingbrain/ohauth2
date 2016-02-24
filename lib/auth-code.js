'use strict'

const nodeify = require('nodeify')
const wreck = require('wreck')
const qs = require('qs')

class AuthorisationCode {

  constructor(config) {
    this._parse(token)
  }

  request(callback) {
    const p = new Promise((resolve, reject) => {
      const payload = {
        grant_type: 'authorization_code'
        response_type: 'code',
        scope: this.config.scope,
        client_id: this.config.client_id,
//        client_secret: this.config.client_secret
      }

      const options = JSON.parse(JSON.stringify(this.config.wreck))
      options.payload = qs.stringify(payload)
      options.headers = options.headers || {}
      options.headers['content-type'] = 'application/x-www-form-urlencoded'

      wreck.post(this.config.auth_url, options, (error, response, payload) => {
        if (error) {
          return reject(error)
        }

        if (response.statusCode !== 200) {
          return reject(new Error('Auth url returned ' + response.statusCode + ': ' + response.statusMessage))
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
