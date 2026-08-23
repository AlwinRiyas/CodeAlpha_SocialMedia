import { prisma } from '../../lib/prisma.js'
import { createNotification } from '../notifications/notifications.repository.js'
import { AppError } from '../../utils/app-error.js'

export async function createComment(userId, postId, payload = {}) {
  const content = String(payload.content ?? '').trim()
  if (!content || content.length > 1000) throw new AppError('Comment must be between 1 and 1000 characters', { statusCode: 400, code: 'VALIDATION_ERROR', expose: true })

  const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true, authorId: true } })
  if (!post) throw new AppError('Post not found', { statusCode: 404, code: 'POST_NOT_FOUND', expose: true })

  const comment = await prisma.comment.create({ data: { authorId: userId, postId, content }, include: { author: { select: { id: true, username: true, displayName: true, avatarUrl: true } } } })
  await createNotification({ type: 'COMMENT', recipientId: post.authorId, actorId: userId, postId })
  return comment
}

export function listComments(postId) {
  return prisma.comment.findMany({ where: { postId }, orderBy: { createdAt: 'asc' }, include: { author: { select: { id: true, username: true, displayName: true, avatarUrl: true } } } })
}
