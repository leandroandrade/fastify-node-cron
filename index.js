const fp = require('fastify-plugin')
const { extname, join } = require('node:path')
const { access, constants, readdir } = require('node:fs/promises')
const cron = require('node-cron')

async function getWorkersFiles (path) {
  const files = await readdir(path)
  return files.filter(file => extname(file) === '.js')
}

async function dirExists (path) {
  try {
    await access(path, constants.R_OK)
    return true
  } catch (e) {
    return false
  }
}

async function fastifyNodeCron (fastify, options) {
  if (!options.workersDir) {
    throw new Error('fastify-node-cron workers directory should be defined')
  }

  const canAccess = await dirExists(options.workersDir)
  if (!canAccess) {
    throw new Error('fastify-node-cron cannot access the workers directory defined')
  }

  const files = await getWorkersFiles(options.workersDir)
  if (!files.length) {
    throw new Error('fastify-node-cron workers directory is empty')
  }

  const decoratorObject = {
    cron,
    workers: Object.create(null)
  }

  for (const file of files) {
    const filepath = join(options.workersDir, file)

    const Worker = require(filepath)
    const instance = new Worker(fastify)

    if (!instance.name) {
      throw new Error('fastify-node-cron worker `name` should be defined')
    }

    if (!instance.cron) {
      throw new Error('fastify-node-cron worker `cron` should be defined')
    }

    if (!cron.validate(instance.cron)) {
      throw new Error(`fastify-node-cron worker '${instance.name}' has invalid cron expression: ${instance.cron}`)
    }

    if (typeof instance.handler === 'undefined') {
      throw new Error('fastify-node-cron worker `handler` should be defined')
    }

    if (instance.handler[Symbol.toStringTag] !== 'AsyncFunction') {
      throw new Error('fastify-node-cron worker `handler` should be async')
    }

    const taskOptions = {
      ...instance.options,
      name: instance.name
    }

    const task = cron.schedule(instance.cron, async () => {
      try {
        await instance.handler()
      } catch (err) {
        fastify.log.error({ err }, `fastify-node-cron worker ${instance.name} finished with error`)
      }
    }, taskOptions)

    decoratorObject.workers[instance.name] = {
      task,
      instance
    }
  }

  fastify.addHook('onClose', async () => {
    const workers = Object.values(decoratorObject.workers)
    await Promise.all(
      workers.map(worker => worker.task.stop())
    )
  })

  fastify.decorate('scheduler', decoratorObject)
}

module.exports = fp(fastifyNodeCron, {
  fastify: '5.x',
  name: 'fastify-node-cron'
})

module.exports.default = fastifyNodeCron
module.exports.fastifyNodeCron = fastifyNodeCron
