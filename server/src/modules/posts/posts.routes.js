import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import { createPostForUser, getFeed, getPost, removePost } from './posts.service.js'
import { validatePagination, validatePostPayload } from './posts.validation.js'

export const postsRouter = Router()
postsRouter.get('/', async (req, res, next) => { try { const data = await getFeed(validatePagination(req.query)); res.status(200).json({ data }) } catch (error) { next(error) } })
postsRouter.get('/:postId', async (req, res, next) => { try { res.status(200).json({ data: await getPost(req.params.postId) }) } catch (error) { next(error) } })
postsRouter.post('/', authenticate, async (req, res, next) => { try { res.status(201).json({ data: await createPostForUser(req.user.id, validatePostPayload(req.body)) }) } catch (error) { next(error) } })
postsRouter.delete('/:postId', authenticate, async (req, res, next) => { try { await removePost(req.user.id, req.params.postId); res.status(204).send() } catch (error) { next(error) } })
