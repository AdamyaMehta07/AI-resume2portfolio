const express = require('express')
const multer = require('multer')
const { callGemini } = require('../utils/gemini')
const { protect, rateLimit, DAILY_LIMIT, getTodayKey } = require('../middleware/authMiddleware')
const Usage = require('../models/Usage')

const router = express.Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
})

async function incrementUsage(userId) {
  await Usage.findOneAndUpdate(
    { userId, date: getTodayKey() },
    { $inc: { count: 1 } },
    { upsert: true, new: true }
  )
}

async function getUsesLeft(userId) {
  const usage = await Usage.findOne({ userId, date: getTodayKey() })
  return Math.max(0, DAILY_LIMIT - (usage?.count || 0))
}

// ── POST /api/parse-resume ─────────────────────────────────
router.post('/parse-resume', protect, rateLimit, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' })
    }

    console.log('File received:', req.file.originalname, '| Type:', req.file.mimetype, '| Size:', req.file.size, 'bytes')

    let resumeText = ''

    if (req.file.mimetype === 'application/pdf') {
      try {
        // Dynamically require pdf-parse to avoid test file issues
        const pdfParse = require('pdf-parse')
        const pdfData = await pdfParse(req.file.buffer)
        resumeText = pdfData.text
        console.log('PDF text extracted, length:', resumeText.length, 'chars')
      } catch (pdfErr) {
        console.error('PDF parse error:', pdfErr.message)
        return res.status(400).json({ error: 'Could not read this PDF. Try copy-pasting your resume text instead.' })
      }
    } else {
      // Plain text file
      resumeText = req.file.buffer.toString('utf-8')
      console.log('Text file read, length:', resumeText.length, 'chars')
    }

    if (!resumeText || resumeText.trim().length < 30) {
      return res.status(400).json({ error: 'Could not extract enough text from the file. Try pasting your resume text instead.' })
    }

    // Call Gemini
    const portfolioData = await callGemini(resumeText)

    // Increment usage
    await incrementUsage(req.user.id)
    const usesLeft = await getUsesLeft(req.user.id)

    console.log('Portfolio generated for user:', req.user.email, '| Uses left:', usesLeft)
    res.json({ ...portfolioData, usesLeft, limit: DAILY_LIMIT })

  } catch (err) {
    console.error('Parse resume error:', err)
    res.status(500).json({ error: 'Failed to process resume. Please try again.' })
  }
})

// ── POST /api/parse-text ───────────────────────────────────
router.post('/parse-text', protect, rateLimit, async (req, res) => {
  try {
    const { text } = req.body

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'No text provided.' })
    }

    if (text.trim().length < 50) {
      return res.status(400).json({ error: 'Text is too short. Please paste your full resume.' })
    }

    console.log('Text received, length:', text.length, 'chars')

    const portfolioData = await callGemini(text)

    await incrementUsage(req.user.id)
    const usesLeft = await getUsesLeft(req.user.id)

    console.log('Portfolio generated for user:', req.user.email, '| Uses left:', usesLeft)
    res.json({ ...portfolioData, usesLeft, limit: DAILY_LIMIT })

  } catch (err) {
    console.error('Parse text error:', err)
    res.status(500).json({ error: 'Failed to process resume text. Please try again.' })
  }
})

module.exports = router