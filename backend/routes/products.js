import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Seed products
router.post('/seed', async (req, res) => {
  const products = [
    { name: "Carbon Runner V1", price: 380, category: "Performance", description: "Lightweight carbon-plated running shoe.", stock: 15, colors: ["Black", "White", "Red"], sizes: ["39","40","41","42","43","44","45"], rating: 4.9, inStock: true, sku: "CR-V1", images: ["https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg"] },
    { name: "Sculpt High-Top", price: 520, category: "Lifestyle", description: "Architectural high-top with premium leather.", stock: 8, colors: ["Black", "White"], sizes: ["39","40","41","42","43","44","45"], rating: 4.8, inStock: true, sku: "SH-V2", images: ["https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg"] },
    { name: "AeroKnit Unyx", price: 290, category: "Minimalist", description: "Seamless knit upper.", stock: 0, colors: ["Black", "Blue"], sizes: ["39","40","41","42","43","44","45"], rating: 4.7, inStock: false, sku: "AK-V3", images: ["https://images.pexels.com/photos/1456705/pexels-photo-1456705.jpeg"] },
    { name: "Vanguard Plaid", price: 410, category: "Lifestyle", description: "CNC-milled structural accents.", stock: 12, colors: ["Black", "White", "Blue"], sizes: ["39","40","41","42","43","44","45"], rating: 4.9, inStock: true, sku: "VP-V4", images: ["https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg"] },
    { name: "Trail Phantom", price: 450, category: "Trail", description: "All-terrain grip.", stock: 6, colors: ["Black", "Red"], sizes: ["39","40","41","42","43","44","45"], rating: 4.8, inStock: true, sku: "TP-V5", images: ["https://images.pexels.com/photos/2048548/pexels-photo-2048548.jpeg"] },
    { name: "Zero-Gravity Elite", price: 680, category: "Performance", description: "Premium racing shoe.", stock: 4, colors: ["White", "Red", "Blue"], sizes: ["39","40","41","42","43","44","45"], rating: 5.0, inStock: true, sku: "ZG-V6", images: ["https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg"] }
  ];

  // Create product (admin only)
router.post('/', auth, async (req, res) => {
  const { name, price, category, description, stock, images, colors, sizes, sku, inStock } = req.body;
  
  try {
    // Check if user is admin (you can add isAdmin field to User model)
    const product = new Product({ name, price, category, description, stock, images, colors, sizes, sku, inStock });
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update product (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Delete product (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
  
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    res.json({ msg: 'Products seeded successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;