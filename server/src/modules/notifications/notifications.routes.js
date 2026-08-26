import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import { listNotifications, markAllNotificationsRead, unreadNotificationCount } from './notifications.service.js'

export const notificationsRouter = Router()
notificationsRouter.use(authenticate)

notificationsRouter.get('/', async (req, res, next) => {
  try { res.status(200).json({ data: await listNotifications(req.user.id) }) }
  catch (error) { next(error) }
})

notificationsRouter.get('/unread-count', async (req, res, next) => {
  try { res.status(200).json({ data: { count: await unreadNotificationCount(req.user.id) } }) }
  catch (error) { next(error) }
})

notificationsRouter.patch('/read-all', async (req, res, next) => {
  try { res.status(200).json({ data: await markAllNotificationsRead(req.user.id) }) }
  catch (error) { next(error) }
})
