module.exports = class PrimaryWorker {
  constructor (fastify) {
    this.fastify = fastify
    this.name = 'primary'
    this.cron = '*/5 * * * * *' // 5 seconds
  }

  async handler () {
    this.fastify.log.info(`worker primary running ${Date.now()}`)
  }
}
