import { prisma } from '../../lib/prisma.js'
import { AppError } from '../../utils/app-error.js'
import { createNotification } from '../notifications/notifications.repository.js'

const userSelect = { id: true, username: true, displayName: true, bio: true, avatarUrl: true }

export async function sendConnectionRequest(senderId, receiverId, io) {
  if (senderId === receiverId) throw new AppError('You cannot connect with yourself', { statusCode: 400, code: 'INVALID_CONNECTION', expose: true })
  const receiver = await prisma.user.findUnique({ where: { id: receiverId }, select: userSelect })
  if (!receiver) throw new AppError('User not found', { statusCode: 404, code: 'USER_NOT_FOUND', expose: true })

  const existing = await prisma.connectionRequest.findUnique({ where: { senderId_receiverId: { senderId, receiverId } } })
  if (existing?.status === 'PENDING') return existing
  if (existing?.status === 'ACCEPTED') return existing

  const reverse = await prisma.connectionRequest.findUnique({ where: { senderId_receiverId: { senderId: receiverId, receiverId: senderId } } })
  if (reverse?.status === 'PENDING') throw new AppError('This user has already sent you a connection request', { statusCode: 409, code: 'REQUEST_RECEIVED', expose: true })
  if (reverse?.status === 'ACCEPTED') throw new AppError('You are already connected', { statusCode: 409, code: 'ALREADY_CONNECTED', expose: true })

  const request = existing
    ? await prisma.connectionRequest.update({ where: { id: existing.id }, data: { status: 'PENDING' } })
    : await prisma.connectionRequest.create({ data: { senderId, receiverId } })

  await createNotification({ type: 'CONNECTION_REQUEST', recipientId: receiverId, actorId: senderId, io })
  return request
}

export async function respondToConnectionRequest(userId, requestId, action, io) {
  const request = await prisma.connectionRequest.findUnique({ where: { id: requestId } })
  if (!request || request.receiverId !== userId) throw new AppError('Connection request not found', { statusCode: 404, code: 'REQUEST_NOT_FOUND', expose: true })
  if (request.status !== 'PENDING') throw new AppError('Connection request is no longer pending', { statusCode: 409, code: 'REQUEST_NOT_PENDING', expose: true })

  if (action === 'ACCEPT') {
    await prisma.$transaction([
      prisma.connectionRequest.update({ where: { id: requestId }, data: { status: 'ACCEPTED' } }),
      prisma.follow.upsert({ where: { followerId_followingId: { followerId: request.senderId, followingId: request.receiverId } }, update: {}, create: { followerId: request.senderId, followingId: request.receiverId } }),
      prisma.follow.upsert({ where: { followerId_followingId: { followerId: request.receiverId, followingId: request.senderId } }, update: {}, create: { followerId: request.receiverId, followingId: request.senderId } }),
    ])
    await createNotification({ type: 'CONNECTION_ACCEPTED', recipientId: request.senderId, actorId: userId, io })
    return { status: 'ACCEPTED' }
  }

  await prisma.connectionRequest.update({ where: { id: requestId }, data: { status: 'DECLINED' } })
  return { status: 'DECLINED' }
}

export async function listIncomingRequests(userId) {
  return prisma.connectionRequest.findMany({ where: { receiverId: userId, status: 'PENDING' }, orderBy: { createdAt: 'desc' }, include: { sender: { select: userSelect } } })
}

export async function getConnectionState(userId, otherUserId) {
  if (userId === otherUserId) return { status: 'SELF' }
  const [outgoing, incoming, follow] = await Promise.all([
    prisma.connectionRequest.findUnique({ where: { senderId_receiverId: { senderId: userId, receiverId: otherUserId } } }),
    prisma.connectionRequest.findUnique({ where: { senderId_receiverId: { senderId: otherUserId, receiverId: userId } } }),
    prisma.follow.findUnique({ where: { followerId_followingId: { followerId: userId, followingId: otherUserId } } }),
  ])
  if (outgoing?.status === 'ACCEPTED' || incoming?.status === 'ACCEPTED') return { status: 'CONNECTED', following: Boolean(follow) }
  if (outgoing?.status === 'PENDING') return { status: 'PENDING_SENT', following: Boolean(follow) }
  if (incoming?.status === 'PENDING') return { status: 'PENDING_RECEIVED', requestId: incoming.id, following: Boolean(follow) }
  return { status: 'NONE', following: Boolean(follow) }
}
