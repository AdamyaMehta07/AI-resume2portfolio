const mongoose = require('mongoose')

// Tracks how many times a user called Gemini API per day
const usageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,   // stored as "2025-04-25"
    required: true
  },
  count: {
    type: Number,
    default: 0
  }
})

// One record per user per day
usageSchema.index({ userId: 1, date: 1 }, { unique: true })

module.exports = mongoose.model('Usage', usageSchema)