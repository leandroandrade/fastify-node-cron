'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const fastifyNodeCron = require('..')
const path = require('path')
const sinon = require('sinon')

test('fastify-node-cron is correctly defined with worker', async t => {
  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  await fastify.register(fastifyNodeCron, {
    workersDir: path.join(__dirname, 'workers')
  })

  await fastify.ready()
  t.ok(fastify.scheduler)
  t.ok(fastify.scheduler.cron)
  t.ok(fastify.scheduler.workers)

  const workerName = 'sample'
  const worker = fastify.scheduler.workers[workerName]
  t.ok(worker)
  t.equal(typeof worker.stop, 'function')
  t.equal(typeof worker.start, 'function')
  t.equal(typeof worker.now, 'function')
})

test('fastify-node-cron should run worker handler function', async t => {
  const clock = sinon.useFakeTimers(new Date(2018, 0, 1, 0, 0, 0, 0))

  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  await fastify.register(fastifyNodeCron, {
    workersDir: path.join(__dirname, 'workers')
  })

  clock.tick(3000)

  const workerName = 'sample'
  t.ok(fastify.scheduler.workers[workerName].task)
  t.equal(fastify.scheduler.workers[workerName].count, 3)

  clock.restore()
})

test('fastify-node-cron should run multiple workers', async t => {
  const clock = sinon.useFakeTimers(new Date(2018, 0, 1, 0, 0, 0, 0))

  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  await fastify.register(fastifyNodeCron, {
    workersDir: path.join(__dirname, 'multiple-workers')
  })

  clock.tick(3000)

  const primaryWorker = 'primary'
  t.ok(fastify.scheduler.workers[primaryWorker].task)
  t.equal(fastify.scheduler.workers.primary.count, 3)

  const secondaryWorker = 'secondary'
  t.ok(fastify.scheduler.workers[secondaryWorker].task)
  t.equal(fastify.scheduler.workers[secondaryWorker].count, 1)

  clock.restore()
})

test('fastify-node-cron return error workersDir not defined', async t => {
  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  try {
    await fastify.register(fastifyNodeCron)
  } catch (err) {
    t.ok(err)
    t.equal(err.message, 'workers directory should be defined')
  }
})

test('fastify-node-cron return error cannot access dir', async t => {
  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  try {
    await fastify.register(fastifyNodeCron, {
      workersDir: './random'
    })
  } catch (err) {
    t.ok(err)
    t.equal(err.message, 'cannot access the workers directory defined')
  }
})

test('fastify-node-cron return error dir is empty', async t => {
  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  try {
    await fastify.register(fastifyNodeCron, {
      workersDir: path.join(__dirname, 'empty')
    })
  } catch (err) {
    t.ok(err)
    t.equal(err.message, 'workers directory is empty')
  }
})

test('fastify-node-cron worker without name', async t => {
  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  try {
    await fastify.register(fastifyNodeCron, {
      workersDir: path.join(__dirname, 'worker-without-name')
    })
  } catch (err) {
    t.ok(err)
    t.equal(err.message, 'worker `name` should be defined')
  }
})

test('fastify-node-cron worker without cron', async t => {
  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  try {
    await fastify.register(fastifyNodeCron, {
      workersDir: path.join(__dirname, 'worker-without-cron')
    })
  } catch (err) {
    t.ok(err)
    t.equal(err.message, 'worker `cron` should be defined')
  }
})

test('fastify-node-cron worker handler is not function', async t => {
  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  try {
    await fastify.register(fastifyNodeCron, {
      workersDir: path.join(__dirname, 'worker-invalid-handler')
    })
  } catch (err) {
    t.ok(err)
    t.equal(err.message, 'worker `handler` should be defined')
  }
})

test('fastify-node-cron worker handler is not async function', async t => {
  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  try {
    await fastify.register(fastifyNodeCron, {
      workersDir: path.join(__dirname, 'worker-handler-not-async')
    })
  } catch (err) {
    t.ok(err)
    t.equal(err.message, 'worker `handler` should be async')
  }
})
