module.exports = class InvalidCronWorker {
  constructor (fastify) {
    this.fastify = fastify
    this.name = 'invalid-cron'
    this.cron = 'invalid cron expression'
  }

  async handler () {
    // This should never be called
  }
}
