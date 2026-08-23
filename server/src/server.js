import http from 'node:http'
import { Server } from 'socket.io'
import app from './app.js'
import { env } from './config/env.js'

const httpServer = http.createServer(app)
const io = new Server(httpServer, { cors: { origin: env.nodeEnv === 'production' ? process.env.CLIENT_URL : true } })

io.on('connection', (socket) => {
  socket.on('notification:subscribe', (userId) => {
    if (typeof userId === 'string' && userId) socket.join(`user:${userId}`)
  })
})

app.set('io', io)

httpServer.listen(env.port, () => {
  console.log(`API server running on http://localhost:${env.port}`)
})

function shutdown(signal) {
  console.log(`${signal} received. Shutting down gracefully.`)
  io.close(() => httpServer.close(() => process.exit(0)))
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
