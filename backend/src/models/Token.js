import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
    unique: true // Only one token per account
  },
  accessToken: {
    type: String,
    required: true // Will be encrypted
  },
  userId: {
    type: String,
    required: true // Kite user ID (for reference)
  },
  generatedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true // Always 6 AM next day
  },
  isValid: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient queries
tokenSchema.index({ accountId: 1 });
tokenSchema.index({ isValid: 1 });
tokenSchema.index({ expiresAt: 1 });

export default mongoose.model('Token', tokenSchema);
