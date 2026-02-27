const express = require('express')
const { Category, MenuItem } = require('../models/Menu')
const auth = require('../middleware/auth')
const router = express.Router()

// GET /api/menu/:restaurantId (public - for customers)
router.get('/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params
    const categories = await Category.find({ restaurantId, isActive: true }).sort('sortOrder')
    const items = await MenuItem.find({ restaurantId }).sort('sortOrder')
    res.json({ categories, items })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/menu/item/:id (public)
router.get('/item/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id)
    if (!item) return res.status(404).json({ message: 'Item not found' })
    res.json(item)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/menu/categories (protected)
router.post('/categories', auth, async (req, res) => {
  try {
    const category = await Category.create(req.body)
    res.status(201).json(category)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/menu/items (protected)
router.post('/items', auth, async (req, res) => {
  try {
    const item = await MenuItem.create(req.body)
    res.status(201).json(item)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PATCH /api/menu/items/:id (protected)
router.patch('/items/:id', auth, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(item)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PATCH /api/menu/items/:id/toggle (protected - toggle availability)
router.patch('/items/:id/toggle', auth, async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id)
    if (!item) return res.status(404).json({ message: 'Item not found' })
    item.isAvailable = !item.isAvailable
    await item.save()
    res.json(item)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/menu/items/:id (protected)
router.delete('/items/:id', auth, async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id)
    res.json({ message: 'Item deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
