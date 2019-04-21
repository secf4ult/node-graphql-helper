// from: https://itnext.io/call-graphql-api-with-native-node-modules-5e4d088ca969
const { readFile } = require('fs')
const { resolve } = require('path')
const { request } = require('https')
const { Readable } = require('stream')

const loadQuery = (fileName) =>
  new Promise((res, reject) => {
    readFile(resolve(fileName), 'utf-8', (err, data) => {
        (err) ? reject(err) : res(data)
    })
})

const appendQuery = (fileName) => (query) =>
  loadQuery(fileName).then((result) => query + results)

const buildBody = (query) =>
  Promise.resolve({
    body: JSON.stringify({query})
}

const buildBodyWithVariables = (variables) => (query) =>
  Promise.resolve({
    body: JSON.stringify({query, variables})
  })

const buildHeaders = ({user, token}) => ({body}) =>
  Promise.resolve({
    body,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': body.length,
      'User-Agent': `${user}`,
      'Authorization': `token ${token}`,
    }
  })

// obejct destruction
const buildRequestOptions = ({headers, body}) =>
  Promise.resolve({
    body,
    options: {
      method: 'POST',
      host: 'api.github.com',
      path: '/graphql',
      port: '443',
      headers
    }
  })

const makeRequest = ({options, body}) =>
  new Promise((resolve, reject) => {
    request(options, (res) => {
      let result = ''
      res.on('data', (chunk) => result += chunk)
      res.on('end', () => resolve(JSON.parse(result)))
      res.on('error', (err) => reject(err))
    }).write(body)
  })

// test
loadQuery('./starGazerFragment.gql')
  .then(appendQuery('./searchStarGazers.gql'))
  .then(buildBodyWithVariables({owner: 'hapijs', name: 'hapi'}))
  .then(buildHeaders({user: '...', token: '...'}))
  .then(buildRequestOptions)
  .then(makeRequest)
  .then((results) => console.dir(results, {depth: null}))


// TODO: ignore by now
// steamable
const = sendRequest = () => loadQuery('./starGazerFragment.gql')
  .then(appendQuery('./searchStarGazers.gql'))
  .then(buildBodyWithVariables({owner: 'hapijs', name: 'hapi'}))
  .then(buildHeaders({user: '...', token: '...'}))
  .then(buildRequestOptions)
  .then(makeRequest)

const createStream = () => new Readable({
  objectMode: true,
  read(opts) {
    if (!this.requestCompleted) {
      return sendRequest().then((data) => {
        this.requestCompleted = true
        this.push(data)
      })
    } else {
      this.push(null)
    }
  }
})

