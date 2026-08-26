import { AppError } from '../../utils/app-error.js'

export function validateCommentPayload(body = {}) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new AppError('Invalid request body', { statusCode: 400, code: 'VALIDATION_ERROR', expose: true })
  const content = typeof body.content === 'string' ? body.content.trim() : ''
  if (!content || content.length > 1000) throw new AppError('Comment must be between 1 and 1000 characters', { statusCode: 400, code: 'VALIDATION_ERROR', expose: true })
  return { content }
}
