const express = require('express')
const Order = require('../models/Order')
const auth = require('../middleware/auth')
const { emitOrderUpdate } = require('../socket')
const router = express.Router()

// POST /api/orders (public - customer places order)
router.post('/', async (req, res) => {
  try {
    const { restaurantId, tableNumber, orderType, items, specialInstructions } = req.body

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
    const tax = parseFloat((subtotal * 0.1).toFixed(2))
    const total = parseFloat((subtotal + tax).toFixed(2))

    const order = await Order.create({
      restaurantId,
      tableNumber,
      orderType: orderType || 'table',
      items,
      subtotal,
      tax,
      total,
      specialInstructions,
      estimatedReadyAt: new Date(Date.now() + 15 * 60 * 1000),
      statusHistory: [{ status: 'pending', timestamp: new Date() }]
    })

    // Emit to restaurant manage app
    const io = req.app.get('io')
    io.to(`restaurant:${restaurantId}`).emit('order:new', order)

    res.status(201).json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/orders/:id (public - customer tracking)
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('restaurantId', 'name')
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/orders?restaurantId=xxx (protected - manage app)
router.get('/', auth, async (req, res) => {
  try {
    const { restaurantId, status, tableNumber } = req.query
    const filter = {}
    if (restaurantId) filter.restaurantId = restaurantId
    if (status) filter.status = status
    if (tableNumber) filter.tableNumber = tableNumber

    const orders = await Order.find(filter).sort('-createdAt').limit(100)
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PATCH /api/orders/:id/status (protected - manage app updates status)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status, note } = req.body
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        $push: { statusHistory: { status, timestamp: new Date(), note } }
      },
      { new: true }
    )

    if (!order) return res.status(404).json({ message: 'Order not found' })

    // Emit real-time update to customer and restaurant
    const io = req.app.get('io')
    emitOrderUpdate(io, order)

    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
