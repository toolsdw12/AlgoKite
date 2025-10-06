import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  accountName: {
    type: String,
    required: true,
    trim: true
  },
  apiKey: {
    type: String,
    required: true,
    trim: true
  },
  apiSecret: {
    type: String,
    required: true,
    trim: true // Will be encrypted before saving
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'never_authenticated'],
    default: 'never_authenticated'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
accountSchema.index({ status: 1 });

export default mongoose.model('Account', accountSchema);
