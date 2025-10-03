module.exports = class ThrowErrorWorker {
  constructor (fastify) {
    this.fastify = fastify
    this.name = 'throwerror'
    this.cron = '* * * * * *'
    this.count = 0
  }

  async handler () {
    this.count++
    throw new Error('kaboom')
  }
}
