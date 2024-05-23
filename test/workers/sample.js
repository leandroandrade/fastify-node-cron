module.exports = class SampleWorker {
  constructor (fastify) {
    this.fastify = fastify
    this.name = 'sample'
    this.cron = '* * * * * *'
  }

  async handler () {
    this.fastify.scheduler.workers[this.name].count = (this.fastify.scheduler.workers[this.name].count || 0) + 1
  }
}
