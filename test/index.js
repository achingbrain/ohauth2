import test from 'ava'
import ohauth2 from '../'
import nock from 'nock'
import faker from 'faker'
import qs from 'qs'

nock.disableNetConnect()

const createToken = (oauth) => oauth.createAccessToken({
  access_token: faker.internet.password(),
  refresh_token: faker.internet.password(),
  expires_in: faker.random.number()
})

const createConfig = (url) => {
  return {
    token_url: url + '/oauth/authorize',
    client_id: faker.random.number(),
    client_secret: faker.internet.password()
  }
}
test('Should work out token expiry date', t => {
  const url = faker.internet.url()
  const config = createConfig(url)
  const oauth = ohauth2(config)
  const token = createToken(oauth)

  t.notOk(token.expired)
})

test('Should refresh token via promise', t => {
  const url = faker.internet.url()
  const config = createConfig(url)
  const oauth = ohauth2(config)
  const oldToken = createToken(oauth)
  const newToken = createToken(oauth)

  nock(url)
    .post('/oauth/authorize', qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: oldToken.refresh_token,
      scope: 'all',
      client_id: config.client_id,
      client_secret: config.client_secret
    }))
    .reply('200', newToken)

  return oldToken.refresh()
    .then(result => {
      t.same(result.access_token, newToken.access_token)
      t.same(result.refresh_token, newToken.refresh_token)
      t.same(result.expires_in, newToken.expires_in)
    })
})

test('Should refresh token via callback', t => {
  const url = faker.internet.url()
  const config = createConfig(url)
  const oauth = ohauth2(config)
  const oldToken = createToken(oauth)
  const newToken = createToken(oauth)

  nock(url)
    .post('/oauth/authorize', qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: oldToken.refresh_token,
      scope: 'all',
      client_id: config.client_id,
      client_secret: config.client_secret
    }))
    .reply('200', newToken)

  return oldToken.refresh((error, result) => {
    t.notOk(error)
    t.same(result.access_token, newToken.access_token)
    t.same(result.refresh_token, newToken.refresh_token)
    t.same(result.expires_in, newToken.expires_in)
  })
})
