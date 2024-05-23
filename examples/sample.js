const fastify = require('fastify')({ logger: true })
const fastifyNodeCron = require('..')
const path = require('path')

fastify.register(fastifyNodeCron, {
  workersDir: path.join(__dirname, 'workers')
})

fastify.listen({ port: 3000 }, err => {
  if (err) throw err
})
