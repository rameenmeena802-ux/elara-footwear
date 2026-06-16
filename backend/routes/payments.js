import express from 'express';
import Stripe from 'stripe';
import auth from '../middleware/auth.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/stripe', auth, async (req, res) => {
  const { amount, currency = 'usd', paymentMethodId } = req.body;
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true
    });
    
    res.json({ success: true, paymentIntent });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

export default router;