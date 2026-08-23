import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import { createComment, listComments } from './comments.service.js'
import { validateCommentPayload } from './comments.validation.js'

export const commentsRouter = Router()
commentsRouter.get('/:postId', async (req, res, next) => { try { res.status(200).json({ data: await listComments(req.params.postId) }) } catch (error) { next(error) } })
commentsRouter.post('/:postId', authenticate, async (req, res, next) => { try { const payload = validateCommentPayload(req.body); res.status(201).json({ data: await createComment(req.user.id, req.params.postId, payload, req.app.get('io')) }) } catch (error) { next(error) } })
