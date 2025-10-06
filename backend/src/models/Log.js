import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  event: {
    type: String,
    enum: ['authenticated', 'expired', 're_authenticated', 'error'],
    required: true
  },
  message: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
logSchema.index({ accountId: 1, timestamp: -1 });
logSchema.index({ event: 1, timestamp: -1 });

export default mongoose.model('Log', logSchema);
