import { Router } from 'express'
import { getUserProfile } from './users.service.js'

export const usersRouter = Router()

usersRouter.get('/:username', async (req, res, next) => {
  try {
    const user = await getUserProfile(req.params.username)
    res.status(200).json({ data: user })
  } catch (error) {
    next(error)
  }
})
