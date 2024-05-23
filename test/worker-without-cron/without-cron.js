module.exports = class WorkerWithoutCron {
  constructor (fastify) {
    this.fastify = fastify
    this.name = 'sample'
  }

  async handler () {
    this.fastify.log.info('worker handler')
  }
}
