const mongoose = require('mongoose')

// Tracks each user's live deployed portfolio site
// One record per user redeploying updates the same Netlify site
// so the live URL stays stable across regenerations
const deploymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  siteId: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  deployedAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Deployment', deploymentSchema)