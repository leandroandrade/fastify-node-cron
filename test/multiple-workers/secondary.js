module.exports = class SecondaryWorker {
  constructor (fastify) {
    this.fastify = fastify
    this.name = 'secondary'
    this.cron = '2 * * * * *'
  }

  async handler () {
    this.fastify.scheduler.workers[this.name].count = (this.fastify.scheduler.workers[this.name].count || 0) + 1
  }
}
