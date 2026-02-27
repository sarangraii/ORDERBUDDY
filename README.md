# OrderBuddy — MERN Stack

AI-native restaurant ordering system with QR-based ordering, real-time tracking, and restaurant management dashboard.

## 🛠 Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **State**: Zustand + TanStack React Query
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Real-time**: Socket.io
- **Auth**: JWT

## 📁 Structure
```
api/                    # Express + MongoDB backend
  src/
    models/             # Mongoose models
    routes/             # REST API routes
    socket/             # Socket.io setup
    config/             # DB connection, seed data

apps/
  order/                # Customer PWA (port 5173)
  manage/               # Restaurant dashboard (port 5174)

docs/                   # Tasks, requirements
```

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
# Edit .env.local with your MongoDB URI
```

### 3. Seed demo data
```bash
cd api && npm run seed
# Outputs: Restaurant ID + manager login
```

### 4. Run everything
```bash
npm run dev
```

| App | URL |
|-----|-----|
| Customer App | http://localhost:5173 |
| Manage App | http://localhost:5174 |
| API | http://localhost:3000/api |

## 🔑 Demo Login (Manage App)
- Email: `manager@orderbuddy.com`
- Password: `password123`

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Manager login |
| GET | /api/restaurants/:id | Get restaurant |
| GET | /api/menu/:restaurantId | Get full menu |
| PATCH | /api/menu/items/:id/toggle | Toggle availability |
| POST | /api/orders | Place order |
| GET | /api/orders/:id | Get order (customer tracking) |
| GET | /api/orders?restaurantId=x | List orders (manage) |
| PATCH | /api/orders/:id/status | Update order status |

## 🔌 Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join:order` | Client→Server | Customer tracks order |
| `join:restaurant` | Client→Server | Manager joins restaurant room |
| `order:new` | Server→Manager | New order placed |
| `order:updated` | Server→Both | Order status changed |
