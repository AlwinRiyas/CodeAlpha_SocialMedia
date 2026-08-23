import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import { getFollowingFeed } from './feed.service.js'

export const feedRouter = Router()

feedRouter.get('/following', authenticate, async (req, res, next) => {
  try {
    const data = await getFollowingFeed(req.user.id, {
      cursor: req.query.cursor,
      limit: req.query.limit,
    })
    res.status(200).json({ data })
  } catch (error) {
    next(error)
  }
})
