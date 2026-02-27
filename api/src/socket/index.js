const { Server } = require('socket.io')

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        process.env.ORDER_APP_URL || 'http://localhost:5173',
        process.env.MANAGE_APP_URL || 'http://localhost:5174'
      ],
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id)

    // Customer joins order room to track their order
    socket.on('join:order', (orderId) => {
      socket.join(`order:${orderId}`)
      console.log(`📦 Socket ${socket.id} joined order:${orderId}`)
    })

    // Manager joins restaurant room to see all orders
    socket.on('join:restaurant', (restaurantId) => {
      socket.join(`restaurant:${restaurantId}`)
      console.log(`🏪 Socket ${socket.id} joined restaurant:${restaurantId}`)
    })

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id)
    })
  })

  return io
}

// Helper to emit order updates
const emitOrderUpdate = (io, order) => {
  // Notify the customer tracking this order
  io.to(`order:${order._id}`).emit('order:updated', order)
  // Notify the restaurant manage app
  io.to(`restaurant:${order.restaurantId}`).emit('order:updated', order)
}

module.exports = initSocket
module.exports.emitOrderUpdate = emitOrderUpdate
