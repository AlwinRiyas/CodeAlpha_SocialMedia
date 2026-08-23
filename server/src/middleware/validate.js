import { AppError } from '../utils/app-error.js'

export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema(req.body)
    if (result.valid) return next()
    next(new AppError(result.message, { statusCode: 400, code: 'VALIDATION_ERROR', expose: true }))
  }
}

export function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema(req.query)
    if (result.valid) return next()
    next(new AppError(result.message, { statusCode: 400, code: 'VALIDATION_ERROR', expose: true }))
  }
}
