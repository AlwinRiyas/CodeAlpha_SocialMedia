import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import { followUser, listFollowers, listFollowing, unfollowUser } from './follows.service.js'

export const followsRouter = Router()

followsRouter.get('/:userId/followers', async (req, res, next) => {
  try { res.status(200).json({ data: await listFollowers(req.params.userId) }) }
  catch (error) { next(error) }
})

followsRouter.get('/:userId/following', async (req, res, next) => {
  try { res.status(200).json({ data: await listFollowing(req.params.userId) }) }
  catch (error) { next(error) }
})

followsRouter.post('/:userId', authenticate, async (req, res, next) => {
  try { res.status(200).json({ data: await followUser(req.user.id, req.params.userId) }) }
  catch (error) { next(error) }
})

followsRouter.delete('/:userId', authenticate, async (req, res, next) => {
  try { res.status(200).json({ data: await unfollowUser(req.user.id, req.params.userId) }) }
  catch (error) { next(error) }
})
