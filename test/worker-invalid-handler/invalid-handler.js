module.exports = class WorkerWithoutHandler {
  constructor (fastify) {
    this.fastify = fastify
    this.name = 'sanitize_db'
    this.cron = '*/1 * * * *'
  }
}
