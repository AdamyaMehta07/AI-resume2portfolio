const express = require('express')
const multer = require('multer')
const pdfParse = require('pdf-parse')
const { callGemini } = require('../utils/gemini')
const { protect, rateLimit, DAILY_LIMIT, getTodayKey } = require('../middleware/authMiddleware')
const Usage = require('../models/Usage')

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

// Helper — increment usage count after successful generation
async function incrementUsage(userId) {
  await Usage.findOneAndUpdate(
    { userId, date: getTodayKey() },
    { $inc: { count: 1 } },
    { upsert: true, new: true }
  )
}

// Helper — get uses left for user today
async function getUsesLeft(userId) {
  const usage = await Usage.findOne({ userId, date: getTodayKey() })
  return Math.max(0, DAILY_LIMIT - (usage?.count || 0))
}

// ── POST /api/parse-resume ───────────────────────────────────
// Accepts PDF or TXT file upload
router.post('/parse-resume', protect, rateLimit, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' })
    }

    let resumeText = ''

    if (req.file.mimetype === 'application/pdf') {
      // Extract text from PDF
      const pdfData = await pdfParse(req.file.buffer)
      resumeText = pdfData.text
    } else {
      // Plain text file
      resumeText = req.file.buffer.toString('utf-8')
    }

    if (!resumeText.trim()) {
      return res.status(400).json({ error: 'Could not extract text from the file. Try pasting text instead.' })
    }

    // Call Gemini AI
    const portfolioData = await callGemini(resumeText)

    // Increment usage after successful call
    await incrementUsage(req.user.id)
    const usesLeft = await getUsesLeft(req.user.id)

    res.json({ ...portfolioData, usesLeft, limit: DAILY_LIMIT })

  } catch (err) {
    console.error('Parse resume error:', err)
    res.status(500).json({ error: 'Failed to process resume. Please try again.' })
  }
})

// ── POST /api/parse-text ─────────────────────────────────────
// Accepts raw resume text in request body
router.post('/parse-text', protect, rateLimit, async (req, res) => {
  try {
    const { text } = req.body

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'No text provided.' })
    }

    if (text.trim().length < 50) {
      return res.status(400).json({ error: 'Text is too short. Please paste your full resume.' })
    }

    // Call Gemini AI
    const portfolioData = await callGemini(text)

    // Increment usage after successful call
    await incrementUsage(req.user.id)
    const usesLeft = await getUsesLeft(req.user.id)

    res.json({ ...portfolioData, usesLeft, limit: DAILY_LIMIT })

  } catch (err) {
    console.error('Parse text error:', err)
    res.status(500).json({ error: 'Failed to process resume text. Please try again.' })
  }
})

module.exports = router