import mongoose from 'mongoose';

const ReferralSchema = new mongoose.Schema({
  referrerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  referralCode: {
    type: String,
    required: true,
    unique: true,
  },
  referredUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isSuccessful: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Referral || mongoose.model('Referral', ReferralSchema);