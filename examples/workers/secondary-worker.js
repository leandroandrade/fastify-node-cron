module.exports = class SecondaryWorker {
  constructor (fastify) {
    this.fastify = fastify
    this.name = 'secondary'
    this.cron = '*/10 * * * * *' // 10 seconds
    this.options = {
      maxExecutions: 10 // Limit to 10 executions (node-cron v4 native feature)
    }
  }

  async handler () {
    this.fastify.log.info(`worker secondary running ${Date.now()}`)

    // Your worker logic here
    this.fastify.log.info('worker secondary completed successfully')
  }
}
