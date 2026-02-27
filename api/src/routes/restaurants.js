const express = require('express')
const Restaurant = require('../models/Restaurant')
const auth = require('../middleware/auth')
const router = express.Router()

// GET /api/restaurants/:id (public - for QR scan)
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' })
    res.json(restaurant)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/restaurants (protected)
router.get('/', auth, async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
    res.json(restaurants)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/restaurants (protected)
router.post('/', auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body)
    res.status(201).json(restaurant)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PATCH /api/restaurants/:id (protected)
router.patch('/:id', auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(restaurant)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
