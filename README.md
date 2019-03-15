# fastify-http-client

[![NPM](https://nodei.co/npm/fastify-http-client.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/fastify-http-client/)

[![Build Status](https://travis-ci.org/kenuyx/fastify-http-client.svg?branch=master)](https://travis-ci.org/kenuyx/fastify-http-client)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
[![codecov](https://codecov.io/gh/kenuyx/fastify-http-client/branch/master/graph/badge.svg)](https://codecov.io/gh/kenuyx/fastify-http-client)
[![Known Vulnerabilities](https://snyk.io/test/github/kenuyx/fastify-http-client/badge.svg?targetFile=package.json)](https://snyk.io/test/github/kenuyx/fastify-http-client?targetFile=package.json)
[![Greenkeeper badge](https://badges.greenkeeper.io/kenuyx/fastify-http-client.svg)](https://greenkeeper.io/)

A plugin for [Fastify](http://fastify.io/) that adds support for sending HTTP(s) requests.

Under the hood [urllib](https://github.com/node-modules/urllib) is used, the options passed to `register` will be used as the default arguments while creating the urllib client.

## Install

```shell
npm i fastify-http-client --save
```

## Usage

Just add it to the project generated via [fastify-cli](https://github.com/fastify/fastify-cli) with `register` in `app.js` as below.

You can access the [urllib](https://github.com/node-modules/urllib) `HttpClient` instance via `fastify.httpclient`, which can be used to send HTTP(s) requests via methods `curl` / `request` / `requestWithCallback` / `requestThunk`. You can also send HTTP(s) requests directly via `fastify.curl`, which is the same function as `request` / `curl` in [urllib](https://github.com/node-modules/urllib).

```js
'use strict'

module.exports = function (fastify, opts, next) {
  fastify.register(require('fastify-http-client'))

  // request via httpclient
  fastify.httpclient.request('https://nodejs.org/en/', (err, body) => {
    console.log('body size: %d', body.length)
  })

  // request via curl method
  fastify.curl('https://nodejs.org/en/').then((result) => {
    console.log('status: %s, body size: %d, headers: %j',
      result.res.statusCode, result.data.length, result.res.headers)
  }).catch((err) => {
    console.error(err)
  })

  next()
}
```

You may also supply an existing [urllib](https://github.com/node-modules/urllib) `HttpClient` instance by passing an options object with the client property set to the instance.

```js
'use strict'

const urllib = require('urllib')

module.exports = function (fastify, opts, next) {
  fastify.register(require('fastify-http-client'), {
    client: urllib.create()
  })

  // ...

  next()
}
```

## Options

Besides `client` property sampled above, properties listed in [urllib / API Doc / Method / Arguments](https://github.com/node-modules/urllib#arguments) are all supported in the options object passed to `register`.

## License

Licensed under [MIT](./LICENSE).
