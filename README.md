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

### Basic Worker Example

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
```

### Advanced Worker Features

```js
// advanced-worker.js
module.exports = class AdvancedWorker {
  constructor (fastify) {
    this.fastify = fastify
    this.name = 'advanced'
    this.cron = '*/10 * * * * *' // 10 seconds

    // Optional: node-cron options
    this.options = {
      scheduled: true,
      timezone: 'America/Sao_Paulo',
      noOverlap: true, // Prevent overlapping executions (node-cron v4 native feature)
      maxExecutions: 5 // Limit number of executions (node-cron v4 native feature)
    }

  }

  async handler () {
    // Your worker logic here
    this.fastify.log.info(`worker ${this.name} running ${Date.now()}`)

    // Simulate work that might fail
    if (Math.random() < 0.3) {
      throw new Error('Simulated failure')
    }
  }
}
```

## Worker Configuration

Each worker class must implement:

- `name` (string): Unique identifier for the worker
- `cron` (string): Valid cron expression for scheduling
- `handler` (async function): The work to be executed

Optional properties:

- `options` (object): Options passed to node-cron schedule method, including:
  - `noOverlap` (boolean): Prevent overlapping executions
  - `maxExecutions` (number): Limit number of executions
  - `timezone` (string): Timezone for the cron schedule
  - `scheduled` (boolean): Whether the task should be scheduled immediately
  - And other node-cron v4 options

## Plugin Configuration

- `workersDir` (string, required): Directory containing worker files

## API

After registration, the plugin decorates Fastify with a `scheduler` object:

```js
// Access the scheduler
fastify.scheduler.cron // node-cron reference
fastify.scheduler.workers // Object containing all registered workers

// Worker control methods
const worker = fastify.scheduler.workers['worker-name']
await worker.task.stop()      // Stop the scheduled task
await worker.task.start()     // Start the scheduled task
await worker.task.execute()   // Run the task immediately
await worker.task.getStatus() // Get task status: 'idle', 'running', 'stopped', etc.
```

## Documentation

More details about `node-cron` documentation, see [node-cron docs](https://github.com/node-cron/node-cron)

## License

[MIT License](https://github.com/leandroandrade/fastify-node-cron/blob/main/LICENSE/)

