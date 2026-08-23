import { io } from 'socket.io-client'
import { getToken } from './auth.js'

const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'
export const socket = io(socketUrl, { autoConnect: false })

export function connectNotifications() {
  socket.auth = { token: getToken() }
  if (!socket.connected) socket.connect()
}
export function disconnectSocket() { socket.disconnect() }
