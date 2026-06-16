import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  stock: { 
    type: Number, 
    default: 10 
  },
  images: { 
    type: [String], 
    default: [] 
  },
  colors: { 
    type: [String], 
    default: [] 
  },
  sizes: { 
    type: [String], 
    default: [] 
  },
  rating: { 
    type: Number, 
    default: 4.5 
  },
  inStock: { 
    type: Boolean, 
    default: true 
  },
  sku: { 
    type: String, 
    unique: true 
  }
}, {
  timestamps: true
});

export default mongoose.model('Product', ProductSchema);