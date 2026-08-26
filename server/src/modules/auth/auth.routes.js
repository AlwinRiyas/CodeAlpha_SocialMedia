import { Router } from 'express'
import { loginUser, registerUser } from './auth.service.js'
import { validateLogin, validateRegistration } from './auth.validation.js'

export const authRouter = Router()
authRouter.post('/register', async (req, res, next) => { try { const result = await registerUser(validateRegistration(req.body)); res.status(201).json({ data: result }) } catch (error) { next(error) } })
authRouter.post('/login', async (req, res, next) => { try { const result = await loginUser(validateLogin(req.body)); res.status(200).json({ data: result }) } catch (error) { next(error) } })
