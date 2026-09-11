import 'dotenv/config'
import { env } from './config/env.js'
import { createApp } from './app.js'

const app = createApp()

const server = app.listen(env.port, '0.0.0.0', () => {
  console.log(`GoPar API em http://localhost:${env.port}`)
})

server.on('error', (error) => {
  console.error('Falha ao iniciar a API:', error.message)
  process.exit(1)
})
