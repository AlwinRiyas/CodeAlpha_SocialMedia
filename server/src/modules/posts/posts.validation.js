import { AppError } from '../../utils/app-error.js'

export function validatePostPayload(body = {}) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new AppError('Invalid request body', { statusCode: 400, code: 'VALIDATION_ERROR', expose: true })
  const content = typeof body.content === 'string' ? body.content.trim() : ''
  if (!content || content.length > 2000) throw new AppError('Post content must be between 1 and 2000 characters', { statusCode: 400, code: 'VALIDATION_ERROR', expose: true })
  let imageUrl = null
  if (body.imageUrl !== undefined && body.imageUrl !== null && String(body.imageUrl).trim()) {
    try { const url = new URL(String(body.imageUrl).trim()); if (!['http:', 'https:'].includes(url.protocol)) throw new Error('protocol'); imageUrl = url.toString() }
    catch { throw new AppError('Image URL must be a valid HTTP or HTTPS URL', { statusCode: 400, code: 'VALIDATION_ERROR', expose: true }) }
  }
  return { content, imageUrl }
}

export function validatePagination(query = {}) {
  const rawLimit = query.limit
  if (rawLimit === undefined) return { cursor: query.cursor || undefined, limit: undefined }
  const limit = Number(rawLimit)
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) throw new AppError('Limit must be an integer between 1 and 50', { statusCode: 400, code: 'VALIDATION_ERROR', expose: true })
  return { cursor: query.cursor || undefined, limit }
}
