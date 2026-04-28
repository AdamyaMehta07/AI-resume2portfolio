const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Usage = require('../models/Usage')
const { protect, DAILY_LIMIT, getTodayKey } = require('../middleware/authMiddleware')

const router = express.Router()

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// ── POST /api/auth/signup ────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required.' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' })
    }
    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email address.' })
    }

    // Check if email already exists
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' })
    }

    // Hash password and save user
    const hashed = await bcrypt.hash(password, 12)
    const user = await User.create({ name, email, password: hashed })
    const token = generateToken(user)

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
      usesLeft: DAILY_LIMIT,
      limit: DAILY_LIMIT
    })

  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
})

// ── POST /api/auth/login ─────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' })
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'No account found with this email.' })
    }

    // Check password
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' })
    }

    // Get today's usage
    const today = getTodayKey()
    const usage = await Usage.findOne({ userId: user._id, date: today })
    const usesLeft = Math.max(0, DAILY_LIMIT - (usage?.count || 0))

    const token = generateToken(user)

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
      usesLeft,
      limit: DAILY_LIMIT
    })

  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
})

// ── GET /api/auth/me ─────────────────────────────────────────
// Returns current logged-in user + how many uses left today
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) return res.status(404).json({ error: 'User not found.' })

    const today = getTodayKey()
    const usage = await Usage.findOne({ userId: user._id, date: today })
    const usesLeft = Math.max(0, DAILY_LIMIT - (usage?.count || 0))

    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      usesLeft,
      limit: DAILY_LIMIT
    })
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch user.' })
  }
})

module.exports = router