import express from 'express';
import jwt from 'jsonwebtoken';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

const router = express.Router();

// ===== CREATE ORDER (Guest checkout allowed) =====
router.post('/create', async (req, res) => {
  const { shippingAddress, items, total, paymentMethod } = req.body;
  
  console.log('📦 Order received:', { itemsCount: items?.length, total, paymentMethod });

  // Check if user is logged in via token
  const token = req.header('x-auth-token');
  let userId = null;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.user.id;
      console.log('👤 User ID:', userId);
    } catch (err) {
      console.log('Guest checkout - token invalid');
    }
  }

  // Validation
  if (!shippingAddress || !items || !total) {
    console.log('❌ Missing fields:', { shippingAddress, items, total });
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
    console.log('✅ Order saved:', order._id);

    // Only clear cart if user is logged in and cart exists
    if (userId) {
      await Cart.findOneAndDelete({ userId });
      console.log('🛒 Cart cleared for user:', userId);
    }

    res.status(201).json(order);
  } catch (err) {
    console.error('❌ Order creation error:', err);
    res.status(500).json({ msg: err.message });
  }
});

// ===== GET USER ORDERS =====
router.get('/my-orders', async (req, res) => {
  const token = req.header('x-auth-token');
  console.log('🔑 Token received:', token ? 'Yes' : 'No');
  
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;
    console.log('👤 Fetching orders for user:', userId);
    
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    console.log('📋 Orders found:', orders.length);
    res.json(orders);
  } catch (err) {
    console.error('❌ Error fetching orders:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
});

// ===== GET SINGLE ORDER =====
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
    console.error('❌ Error fetching order:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
});

// ===== UPDATE ORDER STATUS (ADMIN ONLY) =====
router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  const token = req.header('x-auth-token');
  
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.user.email;
    
    // Admin check
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
    
    console.log('✅ Order status updated:', order._id, '→', status);
    res.json(order);
  } catch (err) {
    console.error('❌ Error updating order:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
});

// ===== GET ALL ORDERS (ADMIN ONLY) =====
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
    console.log('📋 All orders fetched:', orders.length);
    res.json(orders);
  } catch (err) {
    console.error('❌ Error fetching all orders:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
});

export default router;