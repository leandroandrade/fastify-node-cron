module.exports = class OverlapPreventionWorker {
  constructor (fastify) {
    this.fastify = fastify
    this.name = 'overlap-prevention'
    this.cron = '* * * * * *' // every second
    this.options = {
      noOverlap: true
    }
  }

  async handler () {
    // Simulate slow operation
    await new Promise(resolve => setTimeout(resolve, 2000))
    this.fastify.scheduler.workers[this.name].count = (this.fastify.scheduler.workers[this.name].count || 0) + 1
  }
}
