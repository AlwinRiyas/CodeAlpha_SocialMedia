import { AppError } from '../../utils/app-error.js'
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME = /^[a-zA-Z0-9_]{3,30}$/

export function validateRegistration(body = {}) {
  const { email, username, password, displayName } = body
  if (!EMAIL.test(String(email ?? ''))) throw new AppError('A valid email is required', { statusCode: 400, code: 'VALIDATION_ERROR', expose: true })
  if (!USERNAME.test(String(username ?? ''))) throw new AppError('Username must be 3-30 characters and contain only letters, numbers, or underscores', { statusCode: 400, code: 'VALIDATION_ERROR', expose: true })
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) throw new AppError('Password must be between 8 and 128 characters', { statusCode: 400, code: 'VALIDATION_ERROR', expose: true })
  if (typeof displayName !== 'string' || !displayName.trim() || displayName.trim().length > 80) throw new AppError('Display name must be between 1 and 80 characters', { statusCode: 400, code: 'VALIDATION_ERROR', expose: true })
  return { email: email.trim().toLowerCase(), username: username.trim().toLowerCase(), password, displayName: displayName.trim() }
}

export function validateLogin(body = {}) {
  const { email, password } = body
  if (!EMAIL.test(String(email ?? '')) || typeof password !== 'string' || password.length < 1 || password.length > 128) throw new AppError('A valid email and password are required', { statusCode: 400, code: 'VALIDATION_ERROR', expose: true })
  return { email: email.trim().toLowerCase(), password }
}
