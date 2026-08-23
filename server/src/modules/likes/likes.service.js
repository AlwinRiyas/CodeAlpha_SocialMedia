import { prisma } from '../../lib/prisma.js'
import { AppError } from '../../utils/app-error.js'

export async function toggleLike(userId, postId) {
  const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true } })
  if (!post) throw new AppError('Post not found', { statusCode: 404, code: 'POST_NOT_FOUND', expose: true })

  const existing = await prisma.like.findUnique({ where: { userId_postId: { userId, postId } } })
  if (existing) {
    await prisma.like.delete({ where: { userId_postId: { userId, postId } } })
    return { liked: false }
  }

  await prisma.like.create({ data: { userId, postId } })
  return { liked: true }
}
