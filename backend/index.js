const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const authRoutes  = require('./routes/auth')
const parseRoutes = require('./routes/parse')

const app = express()

// ── MIDDLEWARE ──────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}))
app.use(express.json())

// ── ROUTES ──────────────────────────────────
app.use('/api/auth',  authRoutes)
app.use('/api',       parseRoutes)

// ── HEALTH CHECK ────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Resume2Portfolio API is running ' })
})

// ── CONNECT DB + START SERVER ────────────────
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => {
      console.log(`Server running → http://localhost:${PORT}`)
      console.log(`   Health check  → http://localhost:${PORT}/api/health`)
    })
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1)
  })