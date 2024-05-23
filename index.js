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
    throw new Error('workers directory should be defined')
  }

  const canAccess = await dirExists(options.workersDir)
  if (!canAccess) {
    throw new Error('cannot access the workers directory defined')
  }

  const files = await getWorkersFiles(options.workersDir)
  if (!files.length) {
    throw new Error('workers directory is empty')
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
      throw new Error('worker `name` should be defined')
    }

    if (!instance.cron) {
      throw new Error('worker `cron` should be defined')
    }

    if (typeof instance.handler === 'undefined') {
      throw new Error('worker `handler` should be defined')
    }

    if (instance.handler[Symbol.toStringTag] !== 'AsyncFunction') {
      throw new Error('worker `handler` should be async')
    }

    const task = cron.schedule(instance.cron, () => {
      instance.handler()
        .then(() => {
          fastify.log.info(`worker ${instance.name} finished`)
        })
        .catch((err) => {
          fastify.log.error({ err }, `worker ${instance.name} finished with error`)
        })
    }, instance.options)

    decoratorObject.workers[instance.name] = {
      task,
      stop: task.stop.bind(task),
      start: task.start.bind(task),
      now: task.now.bind(task)
    }
  }

  fastify.addHook('onClose', (_, done) => {
    for (const key in decoratorObject.workers) {
      decoratorObject.workers[key].stop()
    }
    done()
  })

  fastify.decorate('scheduler', decoratorObject)
}

module.exports = fp(fastifyNodeCron, {
  fastify: '4.x',
  name: 'fastify-node-cron'
})

module.exports.default = fastifyNodeCron
module.exports.fastifyNodeCron = fastifyNodeCron
