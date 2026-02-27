import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io('/', { transports: ['websocket', 'polling'] })
  }
  return socket
}

export const joinOrderRoom = (orderId: string) => {
  getSocket().emit('join:order', orderId)
}

export const onOrderUpdate = (callback: (order: any) => void) => {
  getSocket().on('order:updated', callback)
  return () => getSocket().off('order:updated', callback)
}

export const disconnectSocket = () => {
  socket?.disconnect()
  socket = null
}
