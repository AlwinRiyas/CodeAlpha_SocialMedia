import { AppError } from '../../utils/app-error.js'
import { findFollowingPosts } from '../posts/posts.repository.js'

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 50

export async function getFollowingFeed(userId, { cursor, limit }) {
  if (!userId) {
    throw new AppError('Authentication is required', {
      statusCode: 401, code: 'UNAUTHORIZED', expose: true,
    })
  }

  const parsedLimit = Number(limit)
  const pageSize = Number.isInteger(parsedLimit)
    ? Math.min(Math.max(parsedLimit, 1), MAX_LIMIT)
    : DEFAULT_LIMIT

  const posts = await findFollowingPosts({ userId, cursor, limit: pageSize })
  const hasMore = posts.length > pageSize
  const items = hasMore ? posts.slice(0, -1) : posts

  return {
    items,
    nextCursor: hasMore ? items.at(-1)?.id ?? null : null,
  }
}
