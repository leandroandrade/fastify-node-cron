# fastify-node-cron

This module provides a way to configure scheduled workers using [node-cron](https://github.com/node-cron/node-cron)

## Install
```
npm i fastify-node-cron
```

## Usage
Add it to you project with `register` and you are done!

```js
const fastify = require('fastify')()

fastify.register(require('fastify-node-cron'), {
    workersDir: path.join(__dirname, 'workers')
})

fastify.listen({ port: 3000 }, err => {
  if (err) throw err
})
```

Into `workers` directory:
```js
// primary-worker.js
module.exports = class PrimaryWorker {
  constructor (fastify) {
    this.fastify = fastify
    this.name = 'primary'
    this.cron = '*/5 * * * * *' // 5 seconds
  }

  async handler () {
    this.fastify.log.info(`worker primary running ${Date.now()}`)
  }
}

// secondary-worker.js
module.exports = class SecondaryWorker {
  constructor (fastify) {
    this.fastify = fastify
    this.name = 'secondary'
    this.cron = '*/10 * * * * *' // 10 seconds
  }

  async handler () {
    this.fastify.log.info(`worker secondary running ${Date.now()}`)
  }
}
```

## Documentation

More details about `node-cron` documentation, see [node-cron docs](https://github.com/node-cron/node-cron)

## License

[MIT License](https://github.com/leandroandrade/fastify-node-cron/blob/main/LICENSE/)

