const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  logo: { type: String, default: '' },
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  isOpen: { type: Boolean, default: true },
  branding: {
    primaryColor: { type: String, default: '#FF6B35' },
    accentColor: { type: String, default: '#1A1A1A' }
  },
  settings: {
    autoAccept: { type: Boolean, default: false },
    estimatedPrepTime: { type: Number, default: 15 }
  }
}, { timestamps: true })

module.exports = mongoose.model('Restaurant', restaurantSchema)
