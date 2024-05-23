module.exports = class PrimaryWorker {
  constructor (fastify) {
    this.fastify = fastify
    this.name = 'primary'
    this.cron = '* * * * * *'
  }

  async handler () {
    this.fastify.scheduler.workers[this.name].count = (this.fastify.scheduler.workers[this.name].count || 0) + 1
  }
}
