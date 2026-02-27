const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  selectedOptions: { type: Map, of: [String], default: {} },
  specialInstructions: { type: String, default: '' },
  subtotal: { type: Number, required: true }
})

const orderSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  tableNumber: { type: String, default: '' },
  orderType: {
    type: String,
    enum: ['table', 'pickup', 'parking'],
    default: 'table'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending'
  },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  specialInstructions: { type: String, default: '' },
  estimatedReadyAt: { type: Date },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String
  }]
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)
