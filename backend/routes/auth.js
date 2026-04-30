const express        = require('express')
const bcrypt         = require('bcryptjs')
const jwt            = require('jsonwebtoken')
const crypto         = require('crypto')
const nodemailer     = require('nodemailer')
const User           = require('../models/User')
const Usage          = require('../models/Usage')
const { protect, DAILY_LIMIT, getTodayKey } = require('../middleware/authMiddleware')

const router = express.Router()

// ── HELPERS ───────────────────────────────────────────────────

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// Creates nodemailer transporter using Gmail
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
}

// ── POST /api/auth/signup ─────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email and password are required.' })
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters.' })
    if (!email.includes('@'))
      return res.status(400).json({ error: 'Please enter a valid email address.' })

    const existing = await User.findOne({ email })
    if (existing)
      return res.status(409).json({ error: 'An account with this email already exists.' })

    const hashed = await bcrypt.hash(password, 12)
    const user   = await User.create({ name, email, password: hashed })
    const token  = generateToken(user)

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

// ── POST /api/auth/login ──────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required.' })

    const user = await User.findOne({ email })
    if (!user)
      return res.status(401).json({ error: 'No account found with this email.' })

    const match = await bcrypt.compare(password, user.password)
    if (!match)
      return res.status(401).json({ error: 'Incorrect password. Please try again.' })

    const today  = getTodayKey()
    const usage  = await Usage.findOne({ userId: user._id, date: today })
    const usesLeft = Math.max(0, DAILY_LIMIT - (usage?.count || 0))
    const token  = generateToken(user)

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

// ── GET /api/auth/me ──────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  try {
    const user  = await User.findById(req.user.id).select('-password')
    if (!user) return res.status(404).json({ error: 'User not found.' })

    const today    = getTodayKey()
    const usage    = await Usage.findOne({ userId: user._id, date: today })
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

// ── POST /api/auth/forgot-password ───────────────────────────
// Generates a reset token and emails the link to the user
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email)
      return res.status(400).json({ error: 'Please provide your email address.' })

    const user = await User.findOne({ email })

    // Always return success even if email not found (security best practice)
    // This prevents attackers from knowing which emails are registered
    if (!user) {
      return res.json({ message: 'If this email exists, a reset link has been sent.' })
    }

    // Generate a secure random token
    const resetToken  = crypto.randomBytes(32).toString('hex')
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    // Save token to user
    user.resetToken       = resetToken
    user.resetTokenExpiry = resetExpiry
    await user.save()

    // Build reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`

    // Send email
    const transporter = createTransporter()
    await transporter.sendMail({
      from:    `"Resume2Portfolio" <${process.env.EMAIL_USER}>`,
      to:      user.email,
      subject: 'Reset your password — Resume2Portfolio',
      html: `
        <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #100a0d; border-radius: 16px; overflow: hidden; border: 1px solid rgba(251,113,133,0.2);">

          <!-- Header -->
          <div style="height: 4px; background: linear-gradient(90deg, #7a1f35, #fb7185, #7a1f35);"></div>
          <div style="padding: 40px 40px 0;">
            <div style="display: inline-block; padding: 4px 14px; background: rgba(251,113,133,0.1); border: 1px solid rgba(251,113,133,0.25); border-radius: 20px; font-size: 12px; color: #fb7185; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 20px;">
              ✦ Resume2Portfolio
            </div>
            <h1 style="font-size: 26px; font-weight: 800; color: #fff0f3; margin: 0 0 8px; letter-spacing: -0.02em;">
              Reset your password
            </h1>
            <p style="font-size: 15px; color: #7a4a56; margin: 0 0 32px; line-height: 1.6;">
              We received a request to reset the password for your account.
              Click the button below — this link expires in <strong style="color: #fb7185;">1 hour</strong>.
            </p>
          </div>

          <!-- Button -->
          <div style="padding: 0 40px 32px; text-align: center;">
            <a href="${resetLink}"
               style="display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #7a1f35, #fb7185); color: white; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; letter-spacing: 0.01em;">
              ✦ Reset My Password
            </a>
          </div>

          <!-- Link fallback -->
          <div style="padding: 0 40px 32px;">
            <p style="font-size: 12px; color: #4a2030; line-height: 1.6;">
              If the button doesn't work, copy and paste this link into your browser:<br/>
              <a href="${resetLink}" style="color: #fb7185; word-break: break-all;">${resetLink}</a>
            </p>
          </div>

          <!-- Footer -->
          <div style="padding: 20px 40px; border-top: 1px solid rgba(251,113,133,0.08); text-align: center;">
            <p style="font-size: 12px; color: #4a2030; margin: 0;">
              If you didn't request this, you can safely ignore this email.<br/>
              Your password will not change.
            </p>
          </div>

        </div>
      `
    })

    console.log('✅ Password reset email sent to:', user.email)
    res.json({ message: 'If this email exists, a reset link has been sent.' })

  } catch (err) {
    console.error('Forgot password error:', err)
    res.status(500).json({ error: 'Failed to send reset email. Please try again.' })
  }
})

// ── POST /api/auth/reset-password ────────────────────────────
// Verifies the token and updates the password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body

    if (!token || !password)
      return res.status(400).json({ error: 'Token and new password are required.' })

    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters.' })

    // Find user with this token that hasn't expired
    const user = await User.findOne({
      resetToken:      token,
      resetTokenExpiry: { $gt: new Date() } // token must not be expired
    })

    if (!user)
      return res.status(400).json({ error: 'This reset link is invalid or has expired. Please request a new one.' })

    // Hash new password and clear reset token
    user.password        = await bcrypt.hash(password, 12)
    user.resetToken      = null
    user.resetTokenExpiry = null
    await user.save()

    console.log('✅ Password reset successful for:', user.email)
    res.json({ message: 'Password updated successfully! You can now log in.' })

  } catch (err) {
    console.error('Reset password error:', err)
    res.status(500).json({ error: 'Failed to reset password. Please try again.' })
  }
})

module.exports = router