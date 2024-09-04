import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  surname: {
    type: String,
    required: [true, 'Please provide your surname'],
  },
  name: {
    type: String,
    required: [true, 'Please provide your name'],
  },
  middleName: {
    type: String,
    // Not required
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);