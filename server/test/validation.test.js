import test from 'node:test'
import assert from 'node:assert/strict'
import { validateLogin, validateRegistration } from '../src/modules/auth/auth.validation.js'
import { validateCommentPayload } from '../src/modules/comments/comments.validation.js'
import { validatePagination, validatePostPayload } from '../src/modules/posts/posts.validation.js'

test('registration normalizes valid input', () => {
  const value = validateRegistration({ email: 'USER@example.com', username: 'Test_User', password: 'password123', displayName: ' User ' })
  assert.equal(value.email, 'user@example.com'); assert.equal(value.username, 'test_user'); assert.equal(value.displayName, 'User')
})
test('registration rejects weak passwords', () => assert.throws(() => validateRegistration({ email: 'a@b.com', username: 'user', password: 'short', displayName: 'User' })))
test('login rejects invalid email', () => assert.throws(() => validateLogin({ email: 'invalid', password: 'secret' })))
test('post accepts HTTPS image URL', () => { const value = validatePostPayload({ content: 'Hello', imageUrl: 'https://example.com/image.png' }); assert.equal(value.imageUrl, 'https://example.com/image.png') })
test('post rejects unsafe image protocol', () => assert.throws(() => validatePostPayload({ content: 'Hello', imageUrl: 'javascript:alert(1)' })))
test('comment rejects empty content', () => assert.throws(() => validateCommentPayload({ content: '   ' })))
test('pagination rejects limits outside range', () => assert.throws(() => validatePagination({ limit: '51' })))
