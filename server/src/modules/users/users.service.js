import { AppError } from '../../utils/app-error.js'
import { findUserById, findUserByUsername, updateUserProfile } from './users.repository.js'

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
  const data = {}
  if (payload.displayName !== undefined) {
    const displayName = String(payload.displayName).trim()
    if (!displayName || displayName.length > 80) throw new AppError('Display name must be between 1 and 80 characters', { statusCode: 400, code: 'VALIDATION_ERROR', expose: true })
    data.displayName = displayName
  }
  if (payload.bio !== undefined) {
    const bio = String(payload.bio).trim()
    if (bio.length > 500) throw new AppError('Bio cannot exceed 500 characters', { statusCode: 400, code: 'VALIDATION_ERROR', expose: true })
    data.bio = bio || null
  }
  if (payload.avatarUrl !== undefined) {
    const avatarUrl = String(payload.avatarUrl).trim()
    if (avatarUrl.length > 2048) throw new AppError('Avatar URL is too long', { statusCode: 400, code: 'VALIDATION_ERROR', expose: true })
    data.avatarUrl = avatarUrl || null
  }
  if (!Object.keys(data).length) throw new AppError('No profile changes provided', { statusCode: 400, code: 'VALIDATION_ERROR', expose: true })
  return updateUserProfile(id, data)
}
