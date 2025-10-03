module.exports = class RetryWorker {
  constructor (fastify) {
    this.fastify = fastify
    this.name = 'retry-worker'
    this.cron = '* * * * * *'
    this.options = {
      maxExecutions: 3 // Limit to 3 executions
    }
  }

  async handler () {
    this.fastify.log.info(`retry worker running ${Date.now()}`)
  }
}
