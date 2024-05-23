module.exports = class WorkerWithoutAsyncHandler {
  constructor (fastify) {
    this.fastify = fastify
    this.name = 'sanitize_db'
    this.cron = '*/1 * * * *'
  }

  handler () {
  }
}
