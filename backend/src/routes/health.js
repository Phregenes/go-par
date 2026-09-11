import { Router } from 'express'
import { pingDatabase } from '../config/db.js'

export const healthRouter = Router()

healthRouter.get('/', async (_req, res) => {
  const database = await pingDatabase()

  res.json({
    ok: true,
    service: 'gopar-api',
    timestamp: new Date().toISOString(),
    database,
  })
})
