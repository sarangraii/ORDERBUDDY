require('dotenv').config({ path: '../../../.env.local' })
const mongoose = require('mongoose')
const Restaurant = require('../models/Restaurant')
const { Category, MenuItem } = require('../models/Menu')
const User = require('../models/User')

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/orderbuddy')
    console.log('Connected to MongoDB')

    // Clear existing
    await Promise.all([
      Restaurant.deleteMany({}),
      Category.deleteMany({}),
      MenuItem.deleteMany({}),
      User.deleteMany({})
    ])

    // Create restaurant
    const restaurant = await Restaurant.create({
      name: 'The Grand Bistro',
      description: 'Fine casual dining with a modern twist',
      address: '123 Main Street, Downtown',
      phone: '+1 555 0100',
      isOpen: true,
      settings: { autoAccept: false, estimatedPrepTime: 15 }
    })

    console.log('✅ Restaurant created:', restaurant._id)

    // Create categories
    const [starters, mains, desserts, drinks] = await Category.insertMany([
      { restaurantId: restaurant._id, name: 'Starters', sortOrder: 1 },
      { restaurantId: restaurant._id, name: 'Main Course', sortOrder: 2 },
      { restaurantId: restaurant._id, name: 'Desserts', sortOrder: 3 },
      { restaurantId: restaurant._id, name: 'Drinks', sortOrder: 4 },
    ])

    // Create menu items
    await MenuItem.insertMany([
      { restaurantId: restaurant._id, categoryId: starters._id, name: 'Crispy Calamari', description: 'Lightly battered squid rings with marinara dip', price: 8.99, isAvailable: true, tags: ['popular'] },
      { restaurantId: restaurant._id, categoryId: starters._id, name: 'Bruschetta', description: 'Grilled bread with tomato, garlic and fresh basil', price: 6.99, isAvailable: true, tags: [] },
      { restaurantId: restaurant._id, categoryId: starters._id, name: 'Caesar Salad', description: 'Romaine lettuce, croutons, parmesan, Caesar dressing', price: 9.99, isAvailable: true, tags: ['healthy'] },
      { restaurantId: restaurant._id, categoryId: mains._id, name: 'Grilled Salmon', description: 'Atlantic salmon with lemon butter sauce and seasonal veg', price: 22.99, isAvailable: true, tags: ['popular', 'healthy'] },
      { restaurantId: restaurant._id, categoryId: mains._id, name: 'Beef Burger', description: 'Half pound Angus beef, cheddar, lettuce, tomato, house sauce', price: 16.99, isAvailable: true, tags: ['popular'] },
      { restaurantId: restaurant._id, categoryId: mains._id, name: 'Pasta Carbonara', description: 'Spaghetti, pancetta, egg, pecorino romano, black pepper', price: 14.99, isAvailable: true, tags: [] },
      { restaurantId: restaurant._id, categoryId: mains._id, name: 'Margherita Pizza', description: 'San Marzano tomatoes, fresh mozzarella, basil', price: 13.99, isAvailable: false, tags: [] },
      { restaurantId: restaurant._id, categoryId: desserts._id, name: 'Tiramisu', description: 'Classic Italian dessert with mascarpone and espresso', price: 7.99, isAvailable: true, tags: [] },
      { restaurantId: restaurant._id, categoryId: desserts._id, name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with liquid center, vanilla ice cream', price: 8.99, isAvailable: true, tags: ['popular'] },
      { restaurantId: restaurant._id, categoryId: drinks._id, name: 'Fresh Lemonade', description: 'House-made with fresh lemons and mint', price: 4.99, isAvailable: true, tags: [] },
      { restaurantId: restaurant._id, categoryId: drinks._id, name: 'Sparkling Water', description: 'San Pellegrino 500ml', price: 3.49, isAvailable: true, tags: [] },
      { restaurantId: restaurant._id, categoryId: drinks._id, name: 'Iced Coffee', description: 'Cold brew with oat milk and vanilla', price: 5.49, isAvailable: true, tags: ['popular'] },
    ])

    // Create manager user
    const user = await User.create({
      name: 'Restaurant Manager',
      email: 'manager@orderbuddy.com',
      password: 'password123',
      role: 'manager',
      restaurantId: restaurant._id
    })

    console.log('✅ Menu items created')
    console.log('✅ Manager user created')
    console.log('')
    console.log('🎉 Seed complete!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Restaurant ID:', restaurant._id.toString())
    console.log('Manager Login: manager@orderbuddy.com / password123')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    process.exit(0)
  } catch (err) {
    console.error('Seed error:', err)
    process.exit(1)
  }
}

seed()
