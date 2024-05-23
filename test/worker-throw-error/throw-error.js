module.exports = class ThrowErrorWorker {
  constructor (fastify) {
    this.fastify = fastify
    this.name = 'throwerror'
    this.cron = '* * * * * *'
  }

  async handler () {
    this.fastify.scheduler.workers[this.name].count = (this.fastify.scheduler.workers[this.name].count || 0) + 1

    throw new Error('kaboom')
  }
}
