import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
  title: String,
  content: String,
  completed: { type: Boolean, default: false },
}, { timestamps: true });

const PaymentMethodSchema = new mongoose.Schema({
  last4: String,
  expirationMonth: String,
  expirationYear: String,
  encryptedNumber: String,
  iv: String,
}, { timestamps: true });

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
  lessons: {
    type: [LessonSchema],
    default: [],
  },
  paymentMethods: {
    type: [PaymentMethodSchema],
    default: [],
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);