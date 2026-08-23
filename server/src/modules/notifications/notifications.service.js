import { prisma } from '../../lib/prisma.js'

const notificationSelect = {
  id: true,
  type: true,
  read: true,
  createdAt: true,
  postId: true,
  actor: { select: { username: true, displayName: true, avatarUrl: true } },
}

export async function listNotifications(userId) {
  return prisma.notification.findMany({ where: { recipientId: userId }, select: notificationSelect, orderBy: { createdAt: 'desc' }, take: 50 })
}

export async function markAllNotificationsRead(userId) {
  await prisma.notification.updateMany({ where: { recipientId: userId, read: false }, data: { read: true } })
  return { success: true }
}

export async function unreadNotificationCount(userId) {
  return prisma.notification.count({ where: { recipientId: userId, read: false } })
}
