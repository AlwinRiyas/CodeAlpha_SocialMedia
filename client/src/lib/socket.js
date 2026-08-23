import { io } from 'socket.io-client'

const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000'
export const socket = io(socketUrl, { autoConnect: false })

export function connectNotifications(userId) {
  if (!socket.connected) socket.connect()
  socket.emit('notification:subscribe', userId)
}

export function disconnectSocket() {
  socket.disconnect()
}
