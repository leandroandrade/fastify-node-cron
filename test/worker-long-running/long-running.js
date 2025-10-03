module.exports = class LongRunningWorker {
  constructor (fastify) {
    this.fastify = fastify
    this.name = 'long-running'
    this.cron = '* * * * * *'
    this.options = {
      noOverlap: true
    }
  }

  async handler () {
    this.fastify.scheduler.workers[this.name].started = true
    await new Promise(resolve => setTimeout(resolve, 500))
    this.fastify.scheduler.workers[this.name].finished = true
  }
}
