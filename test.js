'use strict'

const t = require('tap')
const { test } = t
const Fastify = require('fastify')
const urllib = require('urllib')
const http = require('http')
const https = require('https')

const fastifyCurl = require('./index')

test('fastify.httpclient and fastify.curl should exist', t => {
  t.plan(3)
  const fastify = Fastify()
  fastify.register(fastifyCurl)

  fastify.ready(err => {
    t.error(err)
    t.ok(fastify.httpclient)
    t.ok(fastify.curl)

    fastify.close()
  })
})

test('fastify.httpclient should be an instance of urllib.HttpClient', t => {
  t.plan(3)
  const fastify = Fastify()
  fastify.register(fastifyCurl)

  fastify.ready(err => {
    t.error(err)
    t.ok(fastify.httpclient instanceof urllib.HttpClient)
    t.same(fastify.httpclient.defaultArgs, {})

    fastify.close()
  })
})

test('fastifyCurl can be registered with options', t => {
  t.plan(2)
  const opts = { timeout: 1000 }
  const fastify = Fastify()
  fastify.register(fastifyCurl, opts)

  fastify.ready(err => {
    t.error(err)
    t.same(fastify.httpclient.defaultArgs, opts)

    fastify.close()
  })
})

test('fastify.curl should be the same as urllib.HttpClient.curl method', t => {
  t.plan(4)
  const fastify = Fastify()
  fastify.register(fastifyCurl)

  fastify.ready(err => {
    t.error(err)

    fastify.curl('https://nodejs.org/en/', (err, data, res) => {
      t.error(err)
      t.ok(data instanceof Buffer)
      t.equal(res.statusCode, 200)

      fastify.close()
    })
  })
})

test('a custom client can be assigned', t => {
  t.plan(2)
  const fastify = Fastify()
  const client = urllib.create()
  fastify.register(fastifyCurl, { client })

  fastify.ready(err => {
    t.error(err)
    t.is(fastify.httpclient, client)

    fastify.close()
  })
})

test('a custom http agent can be assigned', t => {
  t.plan(3)
  const fastify = Fastify()
  const agent = new http.Agent()
  fastify.register(fastifyCurl, { agent })

  fastify.ready(err => {
    t.error(err)
    t.ok(fastify.httpclient.hasCustomAgent)
    t.is(fastify.httpclient.agent, agent)

    fastify.close()
  })
})

test('a custom https agent can be assigned', t => {
  t.plan(3)
  const fastify = Fastify()
  const httpsAgent = new https.Agent()
  fastify.register(fastifyCurl, { httpsAgent })

  fastify.ready(err => {
    t.error(err)
    t.ok(fastify.httpclient.hasCustomHttpsAgent)
    t.is(fastify.httpclient.httpsAgent, httpsAgent)

    fastify.close()
  })
})

test('fastify.curl after registered with options should be the same as direct urllib.curl with options', t => {
  t.plan(3)
  const timing = {
    queuing: /\d+/,
    dnslookup: /\d+/,
    connected: /\d+/,
    requestSent: /\d+/,
    waiting: /\d+/,
    contentDownload: /\d+/
  }
  const fastify = Fastify()
  fastify.register(fastifyCurl, { timing: true })

  fastify.ready(async err => {
    t.error(err)

    const { res: { timing: timing1 } } = await fastify.curl('https://nodejs.org/en/')
    t.match(timing1, timing)
    const { res: { timing: timing2 } } = await urllib.curl('https://nodejs.org/en/', { timing: true })
    t.match(timing2, timing)

    fastify.close()
  })
})
