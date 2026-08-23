import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import { toggleLike } from './likes.service.js'

export const likesRouter = Router()
likesRouter.post('/:postId', authenticate, async (req, res, next) => {
  try { res.status(200).json({ data: await toggleLike(req.user.id, req.params.postId, req.app.get('io')) }) }
  catch (error) { next(error) }
})
