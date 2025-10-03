module.exports = class PrimaryWorker {
  constructor (fastify) {
    this.fastify = fastify
    this.name = 'primary'
    this.cron = '*/5 * * * * *' // 5 seconds
    this.options = {
      noOverlap: true // Prevent overlapping executions (node-cron v4 native feature)
    }
  }

  async handler () {
    this.fastify.log.info(`worker primary running ${Date.now()}`)

    // Simulate some work
    await new Promise(resolve => setTimeout(resolve, 1000))

    this.fastify.log.info(`worker primary finished ${Date.now()}`)
  }
}
