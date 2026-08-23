import { findUserById, findUserByUsername } from './users.repository.js'

export async function getUserProfile(username) {
  const user = await findUserByUsername(username)

  if (!user) {
    const error = new Error('User not found')
    error.statusCode = 404
    error.code = 'USER_NOT_FOUND'
    error.expose = true
    throw error
  }

  return user
}

export async function getUserById(id) {
  const user = await findUserById(id)

  if (!user) {
    const error = new Error('User not found')
    error.statusCode = 404
    error.code = 'USER_NOT_FOUND'
    error.expose = true
    throw error
  }

  return user
}
