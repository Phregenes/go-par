import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { activitiesRouter } from './routes/activities.js'
import { healthRouter } from './routes/health.js'

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: env.corsOrigins,
      credentials: true,
    }),
  )
  app.use(express.json())

  app.get('/', (_req, res) => {
    res.json({
      name: 'GoPar API',
      docs: {
        health: '/api/health',
        activities: '/api/activities',
      },
    })
  })

  app.use('/api/health', healthRouter)
  app.use('/api/activities', activitiesRouter)

  app.use((_req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' })
  })

  app.use((error, _req, res, _next) => {
    console.error(error)
    res.status(500).json({ error: 'Erro interno' })
  })

  return app
}
