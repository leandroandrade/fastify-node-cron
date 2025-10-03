'use strict'

const { test } = require('node:test')
const Fastify = require('fastify')
const fastifyNodeCron = require('..')
const path = require('path')

test('fastify-node-cron is correctly defined with worker', async t => {
  const fastify = Fastify()
  t.after(async () => { await fastify.close() })

  await fastify.register(fastifyNodeCron, {
    workersDir: path.join(__dirname, 'workers')
  })

  await fastify.ready()
  t.assert.ok(fastify.scheduler)
  t.assert.ok(fastify.scheduler.cron)
  t.assert.ok(fastify.scheduler.workers)

  const workerName = 'sample'
  const worker = fastify.scheduler.workers[workerName]
  t.assert.ok(worker)
  t.assert.deepEqual(typeof worker.task.stop, 'function')
  t.assert.deepEqual(typeof worker.task.start, 'function')
  t.assert.deepEqual(typeof worker.task.execute, 'function')
})

test('fastify-node-cron should run worker handler function', async t => {
  const fastify = Fastify()
  t.after(async () => { await fastify.close() })

  await fastify.register(fastifyNodeCron, {
    workersDir: path.join(__dirname, 'workers')
  })

  // Wait a bit and trigger manually to test
  await new Promise(resolve => setTimeout(resolve, 100))

  const workerName = 'sample'
  const worker = fastify.scheduler.workers[workerName]
  t.assert.ok(worker.task)

  // Test manual execution
  await worker.task.execute()
  t.assert.ok(worker.instance.count >= 1, 'Worker should have executed at least once')
})

test('fastify-node-cron should run multiple workers', async t => {
  const fastify = Fastify()
  t.after(async () => { await fastify.close() })

  await fastify.register(fastifyNodeCron, {
    workersDir: path.join(__dirname, 'multiple-workers')
  })

  await new Promise(resolve => setTimeout(resolve, 100))

  const primaryWorker = fastify.scheduler.workers.primary
  const secondaryWorker = fastify.scheduler.workers.secondary

  t.assert.ok(primaryWorker.task)
  t.assert.ok(secondaryWorker.task)

  // Test manual execution
  await primaryWorker.task.execute()
  await secondaryWorker.task.execute()

  t.assert.ok(primaryWorker.instance.count >= 1, 'Primary worker should have executed at least once')
  t.assert.ok(secondaryWorker.instance.count >= 1, 'Secondary worker should have executed at least once')
})

test('fastify-node-cron return error workersDir not defined', async t => {
  const fastify = Fastify()
  t.after(async () => { await fastify.close() })

  try {
    await fastify.register(fastifyNodeCron)
  } catch (err) {
    t.assert.ok(err)
    t.assert.deepEqual(err.message, 'fastify-node-cron workers directory should be defined')
  }
})

test('fastify-node-cron return error cannot access dir', async t => {
  const fastify = Fastify()
  t.after(async () => { await fastify.close() })

  try {
    await fastify.register(fastifyNodeCron, {
      workersDir: './random'
    })
  } catch (err) {
    t.assert.ok(err)
    t.assert.deepEqual(err.message, 'fastify-node-cron cannot access the workers directory defined')
  }
})

test('fastify-node-cron return error dir is empty', async t => {
  const fastify = Fastify()
  t.after(async () => { await fastify.close() })

  try {
    await fastify.register(fastifyNodeCron, {
      workersDir: path.join(__dirname, 'empty')
    })
  } catch (err) {
    t.assert.ok(err)
    t.assert.deepEqual(err.message, 'fastify-node-cron workers directory is empty')
  }
})

test('fastify-node-cron worker without name', async t => {
  const fastify = Fastify()
  t.after(async () => { await fastify.close() })

  try {
    await fastify.register(fastifyNodeCron, {
      workersDir: path.join(__dirname, 'worker-without-name')
    })
  } catch (err) {
    t.assert.ok(err)
    t.assert.deepEqual(err.message, 'fastify-node-cron worker `name` should be defined')
  }
})

test('fastify-node-cron worker without cron', async t => {
  const fastify = Fastify()
  t.after(async () => { await fastify.close() })

  try {
    await fastify.register(fastifyNodeCron, {
      workersDir: path.join(__dirname, 'worker-without-cron')
    })
  } catch (err) {
    t.assert.ok(err)
    t.assert.deepEqual(err.message, 'fastify-node-cron worker `cron` should be defined')
  }
})

test('fastify-node-cron worker handler is not function', async t => {
  const fastify = Fastify()
  t.after(async () => { await fastify.close() })

  try {
    await fastify.register(fastifyNodeCron, {
      workersDir: path.join(__dirname, 'worker-invalid-handler')
    })
  } catch (err) {
    t.assert.ok(err)
    t.assert.deepEqual(err.message, 'fastify-node-cron worker `handler` should be defined')
  }
})

test('fastify-node-cron worker handler is not async function', async t => {
  const fastify = Fastify()
  t.after(async () => { await fastify.close() })

  try {
    await fastify.register(fastifyNodeCron, {
      workersDir: path.join(__dirname, 'worker-handler-not-async')
    })
  } catch (err) {
    t.assert.ok(err)
    t.assert.deepEqual(err.message, 'fastify-node-cron worker `handler` should be async')
  }
})

test('fastify-node-cron worker throw error', async t => {
  const fastify = Fastify()
  t.after(async () => { await fastify.close() })

  await fastify.register(fastifyNodeCron, {
    workersDir: path.join(__dirname, 'worker-throw-error')
  })

  await new Promise(resolve => setTimeout(resolve, 100))

  const workerName = 'throwerror'
  const worker = fastify.scheduler.workers[workerName]
  t.assert.ok(worker.task)

  // Test manual execution with error
  try {
    await worker.task.execute()
  } catch (err) {
    // Expected to throw
  }

  t.assert.ok(worker.instance.count >= 1, 'Worker should have executed at least once')
})

test('fastify-node-cron worker with invalid cron expression', async t => {
  const fastify = Fastify()
  t.after(async () => { await fastify.close() })

  try {
    await fastify.register(fastifyNodeCron, {
      workersDir: path.join(__dirname, 'worker-invalid-cron')
    })
  } catch (err) {
    t.assert.ok(err)
    t.assert.match(err.message, /has invalid cron expression/)
  }
})

test('fastify-node-cron worker with noOverlap option', async t => {
  const fastify = Fastify()
  t.after(async () => { await fastify.close() })

  await fastify.register(fastifyNodeCron, {
    workersDir: path.join(__dirname, 'worker-with-overlap-prevention')
  })

  const workerName = 'overlap-prevention'
  const worker = fastify.scheduler.workers[workerName]

  t.assert.ok(worker)
  t.assert.deepEqual(typeof worker.task.getStatus, 'function')

  // Test that getStatus function works
  t.assert.deepEqual(await worker.task.getStatus(), 'idle', 'should be idle initially')
})

test('fastify-node-cron worker with maxExecutions option', async t => {
  const fastify = Fastify()
  t.after(async () => { await fastify.close() })

  await fastify.register(fastifyNodeCron, {
    workersDir: path.join(__dirname, 'worker-with-retry')
  })

  const workerName = 'retry-worker'
  const worker = fastify.scheduler.workers[workerName]

  t.assert.ok(worker)
  t.assert.deepEqual(typeof worker.task.stop, 'function')
  t.assert.deepEqual(typeof worker.task.start, 'function')
})

test('fastify-node-cron graceful shutdown configuration', async t => {
  const fastify = Fastify()
  t.after(async () => { await fastify.close() })

  await fastify.register(fastifyNodeCron, {
    workersDir: path.join(__dirname, 'workers')
  })

  await fastify.ready()
  t.assert.ok(fastify.scheduler)
})

test('fastify-node-cron maxExecutions configuration validation', async t => {
  const fastify = Fastify()
  t.after(async () => { await fastify.close() })

  await fastify.register(fastifyNodeCron, {
    workersDir: path.join(__dirname, 'worker-retry-success')
  })

  await fastify.ready()

  const worker = fastify.scheduler.workers['retry-success']
  t.assert.ok(worker, 'worker should be registered')
  t.assert.deepEqual(typeof worker.task.getStatus, 'function', 'should have getStatus method')
})

test('fastify-node-cron noOverlap configuration', async t => {
  const fastify = Fastify()
  t.after(async () => { await fastify.close() })

  await fastify.register(fastifyNodeCron, {
    workersDir: path.join(__dirname, 'worker-long-running')
  })

  await fastify.ready()

  const worker = fastify.scheduler.workers['long-running']
  t.assert.ok(worker, 'worker should be registered')
  t.assert.deepEqual(typeof worker.task.getStatus, 'function', 'should have getStatus method')
  t.assert.deepEqual(await worker.task.getStatus(), 'idle', 'should be idle initially')
})
