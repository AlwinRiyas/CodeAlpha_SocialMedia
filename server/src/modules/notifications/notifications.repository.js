import { prisma } from '../../lib/prisma.js'

export function createNotification({ type, recipientId, actorId, postId = null }) {
  if (recipientId === actorId) return null
  return prisma.notification.create({ data: { type, recipientId, actorId, postId } })
}
