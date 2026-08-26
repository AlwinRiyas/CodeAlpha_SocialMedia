import { prisma } from '../../lib/prisma.js'

export async function createNotification({ type, recipientId, actorId, postId = null, io = null }) {
  if (recipientId === actorId) return null
  const notification = await prisma.notification.create({ data: { type, recipientId, actorId, postId }, select: { id: true, type: true, read: true, createdAt: true, postId: true, actor: { select: { username: true, displayName: true, avatarUrl: true } } } })
  io?.to(`user:${recipientId}`).emit('notification:new', notification)
  return notification
}
