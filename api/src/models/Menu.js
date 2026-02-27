const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

const choiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  priceModifier: { type: Number, default: 0 }
})

const optionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  required: { type: Boolean, default: false },
  multiSelect: { type: Boolean, default: false },
  choices: [choiceSchema]
})

const menuItemSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true },
  tags: [{ type: String }],
  allergens: [{ type: String }],
  options: [optionSchema],
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true })

const Category = mongoose.model('Category', categorySchema)
const MenuItem = mongoose.model('MenuItem', menuItemSchema)

module.exports = { Category, MenuItem }
