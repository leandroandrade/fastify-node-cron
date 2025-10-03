module.exports = class SampleWorker {
  constructor (fastify) {
    this.fastify = fastify
    this.name = 'sample'
    this.cron = '* * * * * *'
    this.count = 0
  }

  async handler () {
    this.count++
  }
}
