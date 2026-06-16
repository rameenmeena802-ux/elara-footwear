import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// ===== REGISTER =====
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  console.log('Register attempt:', { name, email });

  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please fill in all fields' });
  }

  if (password.length < 6) {
    return res.status(400).json({ msg: 'Password must be at least 6 characters' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: email === 'admin@elara.com'
    });

    await user.save();
    console.log('User saved:', user.email);

    const payload = { user: { id: user.id, email: user.email } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) {
          console.error('JWT Error:', err);
          return res.status(500).json({ msg: 'Token generation failed' });
        }
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
          }
        });
      }
    );
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
});

// ===== LOGIN =====
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt:', { email });

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please fill in all fields' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password incorrect for:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    console.log('Login successful:', email);

    const payload = { user: { id: user.id, email: user.email } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) {
          console.error('JWT Error:', err);
          return res.status(500).json({ msg: 'Token generation failed' });
        }
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin || false
          }
        });
      }
    );
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
});

// ===== VERIFY TOKEN =====
router.get('/verify', async (req, res) => {
  const token = req.header('x-auth-token');
  
  if (!token) {
    return res.json({ valid: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select('-password');
    if (!user) {
      return res.json({ valid: false });
    }
    res.json({ valid: true, user });
  } catch (err) {
    res.json({ valid: false });
  }
});

// ===== SEED ADMIN =====
router.post('/seed-admin', async (req, res) => {
  try {
    await User.deleteOne({ email: 'admin@elara.com' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('elara123', salt);

    const admin = new User({
      name: 'Admin',
      email: 'admin@elara.com',
      password: hashedPassword,
      isAdmin: true
    });

    await admin.save();

    res.json({
      msg: 'Admin created successfully!',
      email: 'admin@elara.com',
      password: 'elara123'
    });
  } catch (err) {
    console.error('Seed admin error:', err);
    res.status(500).json({ msg: err.message });
  }
});

export default router;