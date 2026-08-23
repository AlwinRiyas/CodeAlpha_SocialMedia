import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import { getUserProfile, updateProfile } from './users.service.js'

export const usersRouter = Router()

usersRouter.get('/me', authenticate, (req, res) => {
  res.status(200).json({ data: req.user })
})

usersRouter.patch('/me', authenticate, async (req, res, next) => {
  try {
    const user = await updateProfile(req.user.id, req.body)
    res.status(200).json({ data: user })
  } catch (error) { next(error) }
})

usersRouter.get('/:username', async (req, res, next) => {
  try {
    const user = await getUserProfile(req.params.username)
    res.status(200).json({ data: user })
  } catch (error) { next(error) }
})
