import http from 'node:http'
import jwt from 'jsonwebtoken'
import { Server } from 'socket.io'
import app from './app.js'
import { env } from './config/env.js'

const httpServer = http.createServer(app)
const io = new Server(httpServer, { cors: { origin: env.nodeEnv === 'production' ? process.env.CLIENT_URL : true } })

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token
    if (!token || !process.env.JWT_SECRET) return next(new Error('Unauthorized'))
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    if (!payload?.sub) return next(new Error('Unauthorized'))
    socket.userId = payload.sub
    next()
  } catch { next(new Error('Unauthorized')) }
})
io.on('connection', (socket) => socket.join(`user:${socket.userId}`))
app.set('io', io)
httpServer.listen(env.port, () => console.log(`API server running on http://localhost:${env.port}`))
function shutdown(signal) { console.log(`${signal} received. Shutting down gracefully.`); io.close(() => httpServer.close(() => process.exit(0))) }
process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
