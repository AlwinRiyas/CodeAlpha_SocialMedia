import { AppError } from '../../utils/app-error.js'
import { createPost, deletePost, findPostById, findPosts } from './posts.repository.js'

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 50

export async function getFeed({ cursor, limit }) {
  const parsedLimit = Number(limit)
  const pageSize = Number.isInteger(parsedLimit)
    ? Math.min(Math.max(parsedLimit, 1), MAX_LIMIT)
    : DEFAULT_LIMIT

  const posts = await findPosts({ cursor, limit: pageSize })
  const hasMore = posts.length > pageSize
  const items = hasMore ? posts.slice(0, -1) : posts

  return { items, nextCursor: hasMore ? items.at(-1)?.id ?? null : null }
}

export async function createPostForUser(userId, payload = {}) {
  const content = String(payload.content ?? '').trim()
  const imageUrl = payload.imageUrl ? String(payload.imageUrl).trim() : null

  if (!content || content.length > 2000) {
    throw new AppError('Post content must be between 1 and 2000 characters', {
      statusCode: 400, code: 'VALIDATION_ERROR', expose: true,
    })
  }

  return createPost({ authorId: userId, content, imageUrl })
}

export async function getPost(id) {
  const post = await findPostById(id)
  if (!post) {
    throw new AppError('Post not found', { statusCode: 404, code: 'POST_NOT_FOUND', expose: true })
  }
  return post
}

export async function removePost(userId, postId) {
  const result = await deletePost({ id: postId, authorId: userId })
  if (!result.count) {
    throw new AppError('Post not found or not owned by the current user', {
      statusCode: 404, code: 'POST_NOT_FOUND', expose: true,
    })
  }
}
