import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.use(morgan('dev'))

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'codealpha-socialmedia-api',
  })
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({
    error: 'Internal server error',
  })
})

export default app
