import { Router } from 'express'
import { getFeed } from './posts.service.js'

export const postsRouter = Router()

postsRouter.get('/', async (req, res, next) => {
  try {
    const data = await getFeed({
      cursor: req.query.cursor,
      limit: req.query.limit,
    })

    res.status(200).json({ data })
  } catch (error) {
    next(error)
  }
})
