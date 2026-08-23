import crypto from 'node:crypto'
import { AppError } from '../../utils/app-error.js'
import {
  createUser,
  findAuthUserByEmail,
  findAuthUserByUsername,
} from './auth.repository.js'
import { validateRegistration } from './auth.validation.js'

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export async function registerUser(payload) {
  const data = validateRegistration(payload)

  const [emailExists, usernameExists] = await Promise.all([
    findAuthUserByEmail(data.email),
    findAuthUserByUsername(data.username),
  ])

  if (emailExists) {
    throw new AppError('Email is already registered', {
      statusCode: 409,
      code: 'EMAIL_EXISTS',
      expose: true,
    })
  }

  if (usernameExists) {
    throw new AppError('Username is already taken', {
      statusCode: 409,
      code: 'USERNAME_EXISTS',
      expose: true,
    })
  }

  return createUser({
    email: data.email,
    username: data.username,
    displayName: data.displayName,
    passwordHash: hashPassword(data.password),
  })
}
