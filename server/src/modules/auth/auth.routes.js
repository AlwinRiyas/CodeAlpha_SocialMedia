import { Router } from 'express'
import { loginUser, registerUser } from './auth.service.js'

export const authRouter = Router()

authRouter.post('/register', async (req, res, next) => {
  try {
    const result = await registerUser(req.body)
    res.status(201).json({ data: result })
  } catch (error) {
    next(error)
  }
})

authRouter.post('/login', async (req, res, next) => {
  try {
    const result = await loginUser(req.body)
    res.status(200).json({ data: result })
  } catch (error) {
    next(error)
  }
})
