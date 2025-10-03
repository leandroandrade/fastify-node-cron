module.exports = class PrimaryWorker {
  constructor (fastify) {
    this.fastify = fastify
    this.name = 'primary'
    this.cron = '* * * * * *'
    this.count = 0
  }

  async handler () {
    this.count++
  }
}
