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

export function updateUserProfile(id, data) {
  return prisma.user.update({ where: { id }, data, select: { ...profileSelect, email: true } })
}
