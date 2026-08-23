import { prisma } from '../../lib/prisma.js'

const postInclude = {
  author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
  _count: { select: { comments: true, likes: true } },
}

export function findPosts({ cursor, limit }) {
  return prisma.post.findMany({
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: 'desc' },
    include: postInclude,
  })
}

export function createPost({ authorId, content, imageUrl }) {
  return prisma.post.create({
    data: { authorId, content, imageUrl: imageUrl || null },
    include: postInclude,
  })
}

export function findPostById(id) {
  return prisma.post.findUnique({ where: { id }, include: postInclude })
}

export function deletePost({ id, authorId }) {
  return prisma.post.deleteMany({ where: { id, authorId } })
}
