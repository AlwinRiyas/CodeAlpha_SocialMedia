import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env.js'
import { errorHandler, notFoundHandler } from './middleware/error-handler.js'
import { authRouter } from './modules/auth/auth.routes.js'
import { commentsRouter } from './modules/comments/comments.routes.js'
import { feedRouter } from './modules/feed/feed.routes.js'
import { followsRouter } from './modules/follows/follows.routes.js'
import { likesRouter } from './modules/likes/likes.routes.js'
import { postsRouter } from './modules/posts/posts.routes.js'
import { usersRouter } from './modules/users/users.routes.js'
import { healthRouter } from './routes/health.routes.js'

const app = express()
app.use(helmet())
app.use(cors({ origin: env.nodeEnv === 'production' ? process.env.CLIENT_URL : true }))
app.use(express.json({ limit: '1mb' }))
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'))

app.use('/api/health', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/posts', postsRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/likes', likesRouter)
app.use('/api/follows', followsRouter)
app.use('/api/feed', feedRouter)

app.use(notFoundHandler)
app.use(errorHandler)
export default app
