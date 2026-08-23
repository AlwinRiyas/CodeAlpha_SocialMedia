import { prisma } from '../../lib/prisma.js'

export function findPosts({ cursor, limit }) {
  return prisma.post.findMany({
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      _count: { select: { comments: true, likes: true } },
    },
  })
}
