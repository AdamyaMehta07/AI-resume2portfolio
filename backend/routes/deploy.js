const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const { deployPortfolio } = require('../utils/netlify')
const Deployment = require('../models/Deployment')

const router = express.Router()

// ── POST /api/deploy
// Body: { html: "<!DOCTYPE html>..." }
// Deploys the portfolio HTML to Netlify (creating a site the first time, redeploying to the same site on subsequent calls) and returns the live URL.
router.post('/deploy', protect, async (req, res) => {
  try {
    const { html } = req.body

    if (!html || html.trim().length < 50) {
      return res.status(400).json({ error: 'No portfolio HTML provided. Generate your portfolio first.' })
    }

    const existing = await Deployment.findOne({ userId: req.user.id })

    console.log('Deploying portfolio for user:', req.user.email || req.user.id, existing ? '(redeploy)' : '(new site)')

    const { siteId, url } = await deployPortfolio({
      html,
      existingSiteId: existing?.siteId
    })

    const deployment = await Deployment.findOneAndUpdate(
      { userId: req.user.id },
      { siteId, url, deployedAt: new Date() },
      { upsert: true, new: true }
    )

    console.log('Deploy SUCCESS —', deployment.url)
    res.json({ url: deployment.url, deployedAt: deployment.deployedAt })

  } catch (err) {
    console.error('Deploy error:', err)
    if (err.isDeployFailure) {
      return res.status(502).json({ error: err.message })
    }
    res.status(500).json({ error: 'Failed to deploy portfolio. Please try again.' })
  }
})

module.exports = router