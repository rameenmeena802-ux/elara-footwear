import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    size: String,
    quantity: Number,
    image: String
  }],
  total: { type: Number, required: true },
  shippingAddress: {
    fullName: String,
    street: String,
    city: String,
    zipCode: String,
    phone: String
  },
  status: { type: String, default: 'pending', enum: ['pending', 'paid', 'shipped', 'delivered'] },
  paymentId: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', OrderSchema);