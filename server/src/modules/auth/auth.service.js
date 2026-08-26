import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
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

function verifyPassword(password, stored) {
  const [salt, expectedHash] = stored.split(':')
  const actualHash = crypto.scryptSync(password, salt, 64).toString('hex')
  return crypto.timingSafeEqual(
    Buffer.from(actualHash, 'hex'),
    Buffer.from(expectedHash, 'hex'),
  )
}

function issueToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured')
  }

  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
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

  const user = await createUser({
    email: data.email,
    username: data.username,
    displayName: data.displayName,
    passwordHash: hashPassword(data.password),
  })

  return { user, token: issueToken(user.id) }
}

export async function loginUser(payload = {}) {
  const email = String(payload.email ?? '').trim().toLowerCase()
  const password = payload.password

  if (!email || typeof password !== 'string') {
    throw new AppError('Email and password are required', {
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      expose: true,
    })
  }

  const user = await findAuthUserByEmail(email)

  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw new AppError('Invalid email or password', {
      statusCode: 401,
      code: 'INVALID_CREDENTIALS',
      expose: true,
    })
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    },
    token: issueToken(user.id),
  }
}
