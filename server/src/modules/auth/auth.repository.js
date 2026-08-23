import { prisma } from '../../lib/prisma.js'

export function findAuthUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } })
}

export function findAuthUserByUsername(username) {
  return prisma.user.findUnique({ where: { username } })
}

export function createUser(data) {
  return prisma.user.create({
    data,
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,
    },
  })
}
