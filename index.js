'use strict'

const fp = require('fastify-plugin')
const urllib = require('urllib')

async function fastifyCurl (fastify, opts) {
  opts = opts || {}
  let { client, agent, httpsAgent, ...defaultArgs } = opts
  if (!client) {
    client = urllib.create({ defaultArgs, agent, httpsAgent })
  }
  fastify.decorate('httpclient', client)
  fastify.decorate('curl', (url, args, callback) => fastify.httpclient.curl(url, args, callback))
}

module.exports = fp(fastifyCurl, {
  fastify: '>=2.0.0',
  name: 'fastify-curl'
})
