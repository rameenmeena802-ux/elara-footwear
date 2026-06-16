import express from 'express';
import auth from '../middleware/auth.js';
import Cart from '../models/Cart.js';

const router = express.Router();

// Get cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [], total: 0 });
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Add to cart
router.post('/add', auth, async (req, res) => {
  const { productId, name, price, size, quantity, image } = req.body;
  
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [], total: 0 });
    }
    
    const existingItem = cart.items.find(item => 
      item.productId.toString() === productId && item.size === size
    );
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, name, price, size, quantity, image });
    }
    
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.updatedAt = Date.now();
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update quantity
router.put('/update/:itemId', auth, async (req, res) => {
  const { quantity } = req.body;
  
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ msg: 'Item not found' });
    
    item.quantity = quantity;
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Remove from cart
router.delete('/remove/:itemId', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user.id });
    res.json({ msg: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;