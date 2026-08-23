import { AppError } from '../../utils/app-error.js'
import { findUserById, findUserByUsername, updateUserProfile } from './users.repository.js'

function validateHttpUrl(value, field) {
  if (!value) return null
  try { const url = new URL(value); if (!['http:', 'https:'].includes(url.protocol)) throw new Error(); return url.toString() }
  catch { throw new AppError(`${field} must be a valid HTTP or HTTPS URL`, { statusCode: 400, code: 'VALIDATION_ERROR', expose: true }) }
}
export async function getUserProfile(username) {
  const user = await findUserByUsername(username)
  if (!user) throw new AppError('User not found', { statusCode: 404, code: 'USER_NOT_FOUND', expose: true })
  return user
}
export async function getUserById(id) {
  const user = await findUserById(id)
  if (!user) throw new AppError('User not found', { statusCode: 404, code: 'USER_NOT_FOUND', expose: true })
  return user
}
export async function updateProfile(id, payload = {}) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new AppError('Invalid request body', { statusCode: 400, code: 'VALIDATION_ERROR', expose: true })
  const allowed = ['displayName', 'bio', 'avatarUrl']
  if (Object.keys(payload).some((key) => !allowed.includes(key))) throw new AppError('Invalid profile field', { statusCode: 400, code: 'VALIDATION_ERROR', expose: true })
  const data = {}
  if (payload.displayName !== undefined) { const value = String(payload.displayName).trim(); if (!value || value.length > 80) throw new AppError('Display name must be between 1 and 80 characters', { statusCode: 400, code: 'VALIDATION_ERROR', expose: true }); data.displayName = value }
  if (payload.bio !== undefined) { const value = String(payload.bio).trim(); if (value.length > 500) throw new AppError('Bio cannot exceed 500 characters', { statusCode: 400, code: 'VALIDATION_ERROR', expose: true }); data.bio = value || null }
  if (payload.avatarUrl !== undefined) { const value = String(payload.avatarUrl).trim(); if (value.length > 2048) throw new AppError('Avatar URL is too long', { statusCode: 400, code: 'VALIDATION_ERROR', expose: true }); data.avatarUrl = validateHttpUrl(value, 'Avatar URL') }
  if (!Object.keys(data).length) throw new AppError('No profile changes provided', { statusCode: 400, code: 'VALIDATION_ERROR', expose: true })
  return updateUserProfile(id, data)
}
