import { Router } from 'express'
import { activities } from '../data/activities.js'

export const activitiesRouter = Router()

activitiesRouter.get('/', (req, res) => {
  const category = String(req.query.category ?? '').toLowerCase()
  const items = category
    ? activities.filter((activity) => activity.category === category)
    : activities

  res.json({ items })
})

activitiesRouter.get('/:id', (req, res) => {
  const activity = activities.find((item) => item.id === req.params.id)

  if (!activity) {
    res.status(404).json({ error: 'Atividade não encontrada' })
    return
  }

  res.json({ item: activity })
})
