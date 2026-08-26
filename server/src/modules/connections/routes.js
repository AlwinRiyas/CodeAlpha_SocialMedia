import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import { getConnectionState, listIncomingRequests, respondToConnectionRequest, sendConnectionRequest } from './connections.service.js'

export const connectionsRouter = Router()

connectionsRouter.get('/requests/incoming', authenticate, async (req, res, next) => {
  try { res.status(200).json({ data: await listIncomingRequests(req.user.id) }) } catch (error) { next(error) }
})

connectionsRouter.get('/state/:userId', authenticate, async (req, res, next) => {
  try { res.status(200).json({ data: await getConnectionState(req.user.id, req.params.userId) }) } catch (error) { next(error) }
})

connectionsRouter.post('/:userId', authenticate, async (req, res, next) => {
  try { res.status(201).json({ data: await sendConnectionRequest(req.user.id, req.params.userId, req.app.get('io')) }) } catch (error) { next(error) }
})

connectionsRouter.post('/requests/:requestId/:action', authenticate, async (req, res, next) => {
  try {
    const action = String(req.params.action).toUpperCase()
    if (!['ACCEPT', 'DECLINE'].includes(action)) return res.status(400).json({ error: { code: 'INVALID_ACTION', message: 'Action must be accept or decline' } })
    res.status(200).json({ data: await respondToConnectionRequest(req.user.id, req.params.requestId, action, req.app.get('io')) })
  } catch (error) { next(error) }
})
