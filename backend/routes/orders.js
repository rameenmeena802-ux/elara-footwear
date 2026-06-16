import express from 'express';
import jwt from 'jsonwebtoken';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

const router = express.Router();

// Create order (Guest checkout allowed - NO AUTH REQUIRED)
router.post('/create', async (req, res) => {
  const { shippingAddress, items, total, paymentMethod } = req.body;
  
  // Check if user is logged in via token (optional)
  const token = req.header('x-auth-token');
  let userId = null;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.user.id;
    } catch (err) {
      // Token invalid, proceed as guest
      console.log('Guest checkout - token invalid');
    }
  }

  // Validation
  if (!shippingAddress || !items || !total) {
    return res.status(400).json({ msg: 'Missing required fields' });
  }

  if (!shippingAddress.email || !shippingAddress.email.includes('@')) {
    return res.status(400).json({ msg: 'Valid email is required' });
  }

  try {
    // Create order
    const order = new Order({
      userId: userId || null,
      email: shippingAddress.email,
      items,
      total,
      shippingAddress,
      paymentMethod: paymentMethod || 'card',
      status: 'pending'
    });
    await order.save();

    // Only clear cart if user is logged in and cart exists
    if (userId) {
      await Cart.findOneAndDelete({ userId });
    }

    res.status(201).json(order);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ msg: err.message });
  }
});

// Get user orders (requires auth)
router.get('/my-orders', async (req, res) => {
  const token = req.header('x-auth-token');
  
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;
    
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
});

// Get single order (requires auth)
router.get('/:id', async (req, res) => {
  const token = req.header('x-auth-token');
  
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    if (order.userId && order.userId.toString() !== userId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    res.json(order);
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
});

// Update order status (ADMIN ONLY)
router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  const token = req.header('x-auth-token');
  
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.user.email;
    
    if (userEmail !== 'admin@elara.com') {
      return res.status(403).json({ msg: 'Admin access required' });
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
});

// Get all orders (ADMIN ONLY)
router.get('/admin/all', async (req, res) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.user.email;
    
    if (userEmail !== 'admin@elara.com') {
      return res.status(403).json({ msg: 'Admin access required' });
    }
    
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
});

// ✅ DEFAULT EXPORT (YEH ZAROORI HAI)
export default router;