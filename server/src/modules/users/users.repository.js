import { prisma } from '../../lib/prisma.js'

const profileSelect = {
  id: true,
  username: true,
  displayName: true,
  bio: true,
  avatarUrl: true,
  createdAt: true,
  _count: { select: { posts: true, followers: true, following: true } },
}

export function findUserById(id) {
  return prisma.user.findUnique({ where: { id }, select: { ...profileSelect, email: true } })
}

export function findUserByUsername(username) {
  return prisma.user.findUnique({ where: { username }, select: profileSelect })
}

export function searchUsers(query, excludeId, limit = 20) {
  return prisma.user.findMany({
    where: { AND: [{ id: { not: excludeId } }, { OR: [{ username: { contains: query, mode: 'insensitive' } }, { displayName: { contains: query, mode: 'insensitive' } }, { bio: { contains: query, mode: 'insensitive' } }] }] },
    take: limit,
    orderBy: [{ followers: { _count: 'desc' } }, { createdAt: 'desc' }],
    select: profileSelect,
  })
}

export function discoverUsers(excludeId, limit = 12) {
  return prisma.user.findMany({ where: { id: { not: excludeId } }, take: limit, orderBy: [{ followers: { _count: 'desc' } }, { createdAt: 'desc' }], select: profileSelect })
}

export function updateUserProfile(id, data) {
  return prisma.user.update({ where: { id }, data, select: { ...profileSelect, email: true } })
}
