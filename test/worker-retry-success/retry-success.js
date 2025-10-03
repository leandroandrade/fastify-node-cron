module.exports = class RetrySuccessWorker {
  constructor (fastify) {
    this.fastify = fastify
    this.name = 'retry-success'
    this.cron = '* * * * * *'
    this.options = {
      maxExecutions: 2 // Limit to 2 executions
    }
  }

  async handler () {
    this.fastify.log.info(`retry success worker running ${Date.now()}`)
  }
}
