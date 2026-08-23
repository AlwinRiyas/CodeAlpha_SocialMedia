import { Router } from 'express'
import { registerUser } from './auth.service.js'

export const authRouter = Router()

authRouter.post('/register', async (req, res, next) => {
  try {
    const user = await registerUser(req.body)
    res.status(201).json({ data: user })
  } catch (error) {
    next(error)
  }
})
