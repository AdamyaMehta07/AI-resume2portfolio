const jwt = require('jsonwebtoken')
const Usage = require('../models/Usage')

const DAILY_LIMIT = 5

function getTodayKey() {
  return new Date().toISOString().split('T')[0]  // "2025-04-25"
}

// ── JWT PROTECT ──────────────────────────────────────────────
// Checks Authorization: Bearer <token> header
// Attaches decoded user to req.user
async function protect(req, res, next) {
  try {
    const header = req.headers.authorization

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Not logged in. Please sign in first.'
      })
    }

    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()

  } catch (err) {
    return res.status(401).json({
      error: 'Session expired. Please log in again.'
    })
  }
}

// ── RATE LIMIT ───────────────────────────────────────────────
// Allows max 5 Gemini API calls per user per day
async function rateLimit(req, res, next) {
  try {
    const today = getTodayKey()

    let usage = await Usage.findOne({ userId: req.user.id, date: today })

    if (!usage) {
      usage = await Usage.create({ userId: req.user.id, date: today, count: 0 })
    }

    if (usage.count >= DAILY_LIMIT) {
      return res.status(429).json({
        error: `Daily limit reached. You have used all ${DAILY_LIMIT} generations for today. Come back tomorrow!`,
        usesLeft: 0,
        limit: DAILY_LIMIT
      })
    }

    req.usage = usage   // pass to route so we can increment after success
    next()

  } catch (err) {
    console.error('Rate limit error:', err)
    next(err)
  }
}

module.exports = { protect, rateLimit, DAILY_LIMIT, getTodayKey }