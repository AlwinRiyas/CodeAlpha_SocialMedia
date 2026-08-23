import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate.js'

export const meRouter = Router()

meRouter.get('/', authenticate, (req, res) => {
  res.status(200).json({ data: req.user })
})
