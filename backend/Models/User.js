import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  addresses: [{
    fullName: String,
    street: String,
    city: String,
    zipCode: String,
    phone: String
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);