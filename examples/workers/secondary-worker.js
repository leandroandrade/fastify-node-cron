module.exports = class SecondaryWorker {
  constructor (fastify) {
    this.fastify = fastify
    this.name = 'secondary'
    this.cron = '*/10 * * * * *' // 10 seconds
  }

  async handler () {
    this.fastify.log.info(`worker secondary running ${Date.now()}`)
  }
}
