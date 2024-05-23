module.exports = class WorkerWithoutName {
  constructor (fastify) {
    this.fastify = fastify
    this.cron = '*/1 * * * *'
  }

  async handler () {
    this.fastify.log.info('worker handler')
  }
}
