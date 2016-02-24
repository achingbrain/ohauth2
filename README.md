# ohauth2

An oauth2 client that uses Wreck for a transport

## Installing

```
$ npm install ohauth2
```

## Refreshing tokens

```javascript
const ohauth2 = require('ohauth2')({
  client_id: 23098,
  client_secret: '23o0ds',
  scope: 'all',
  token_url: 'https://example.com/oauth/token'
})

module.exports = (request) => {
  // request.auth.credentials contains:
  // {
  //  access_token: string,
  //  refresh_token: string,
  //  expires_in: number,  // seconds
  //  expires_at: timestamp // ms, optional - defaults to (Date.now() + (expires_in * 1000))
  // }

  // create a token from an existing session
  const token = ohauth2.createAccessToken(request.auth.credentials)

  // default action is to resolve the existing token
  let refreshTokenIfNeccessary = Promise.resolve(token)

  if (token.expired) {
    // oops, we've expired - use the refresh_token to get a new access_token
    refreshTokenIfNeccessary = token.refresh()
  }

  return refreshTokenIfNeccessary
    .then(token => {
      if (token.access_token !== credentials.access_token) {
        // a new token has been retrieved, set it on the session for later use
        request.auth.session.set(token)
      }

      return Promise.resolve(token)
    })
}
```
