require('dotenv').config({ path: '../../.env.local' })
const express = require('express')
const { createServer } = require('http')
const cors = require('cors')
const morgan = require('morgan')
const connectDB = require('./config/db')
const initSocket = require('./socket')

// Routes
const restaurantRoutes = require('./routes/restaurants')
const menuRoutes = require('./routes/menu')
const orderRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')

const app = express()
const httpServer = createServer(app)

// Connect DB
connectDB()

// Init Socket.io
const io = initSocket(httpServer)
app.set('io', io)

// Middleware
app.use(cors({
  origin: [
    process.env.ORDER_APP_URL || 'http://localhost:5173',
    process.env.MANAGE_APP_URL || 'http://localhost:5174'
  ],
  credentials: true
}))
app.use(express.json())
app.use(morgan('dev'))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/restaurants', restaurantRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/orders', orderRoutes)

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }))

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' })
})

const PORT = process.env.PORT || 3000
httpServer.listen(PORT, () => {
  console.log(`🚀 OrderBuddy API running on http://localhost:${PORT}`)
  console.log(`📡 Socket.io ready`)
})
