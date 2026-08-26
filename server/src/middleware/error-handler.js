export function notFoundHandler(req, res) {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} was not found`,
    },
  })
}

export function errorHandler(error, req, res, next) {
  void next
  console.error(error)

  if (error.code === 'P2002') {
    return res.status(409).json({
      error: { code: 'CONFLICT', message: 'A record with that value already exists' },
    })
  }

  return res.status(error.statusCode ?? 500).json({
    error: {
      code: error.code ?? 'INTERNAL_ERROR',
      message: error.expose ? error.message : 'An unexpected error occurred',
    },
  })
}
