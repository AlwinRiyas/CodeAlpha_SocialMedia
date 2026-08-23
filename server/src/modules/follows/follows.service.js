import { prisma } from '../../lib/prisma.js'
import { createNotification } from '../notifications/notifications.repository.js'
import { AppError } from '../../utils/app-error.js'

export async function followUser(followerId, followingId) {
  if (followerId === followingId) throw new AppError('You cannot follow yourself', { statusCode: 400, code: 'INVALID_FOLLOW', expose: true })
  const user = await prisma.user.findUnique({ where: { id: followingId }, select: { id: true } })
  if (!user) throw new AppError('User not found', { statusCode: 404, code: 'USER_NOT_FOUND', expose: true })

  const existing = await prisma.follow.findUnique({ where: { followerId_followingId: { followerId, followingId } } })
  if (!existing) {
    await prisma.follow.create({ data: { followerId, followingId } })
    await createNotification({ type: 'FOLLOW', recipientId: followingId, actorId: followerId })
  }
  return { following: true }
}

export async function unfollowUser(followerId, followingId) {
  await prisma.follow.deleteMany({ where: { followerId, followingId } })
  return { following: false }
}

export async function listFollowers(userId) {
  return prisma.follow.findMany({ where: { followingId: userId }, orderBy: { createdAt: 'desc' }, include: { follower: { select: { id: true, username: true, displayName: true, avatarUrl: true } } } })
}

export async function listFollowing(userId) {
  return prisma.follow.findMany({ where: { followerId: userId }, orderBy: { createdAt: 'desc' }, include: { following: { select: { id: true, username: true, displayName: true, avatarUrl: true } } } })
}
