module.exports = class SecondaryWorker {
  constructor (fastify) {
    this.fastify = fastify
    this.name = 'secondary'
    this.cron = '2 * * * * *'
    this.count = 0
  }

  async handler () {
    this.count++
  }
}
