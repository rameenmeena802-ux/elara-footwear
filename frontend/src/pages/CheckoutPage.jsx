import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock, AlertCircle, Banknote, Truck, Wallet } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState('shipping');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const TAX = total * 0.10;
  const SHIP = 10;
  const grand = total + TAX + SHIP;

  const [addr, setAddr] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    street: '',
    city: '',
    zipCode: '',
    phone: '',
  });

  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!addr.fullName || !addr.email || !addr.street || !addr.city || !addr.zipCode || !addr.phone) {
      setError('Please fill in all shipping fields');
      setLoading(false);
      return;
    }

    if (!addr.email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        name: item.product.name,
        price: item.product.price,
        size: item.size,
        quantity: item.quantity,
        image: item.product.images?.[0] || item.product.image || '',
      }));

      const orderData = {
        items: orderItems,
        total: parseFloat(grand.toFixed(2)),
        shippingAddress: {
          fullName: addr.fullName,
          email: addr.email,
          street: addr.street,
          city: addr.city,
          zipCode: addr.zipCode,
          phone: addr.phone,
        },
        paymentMethod,
        // If user is logged in, add userId; otherwise, it's a guest order
        ...(user && { userId: user.id }),
      };

      const res = await api.post('/orders/create', orderData);
      
      clearCart();
      navigate('/order-confirmation', {
        state: {
          orderId: res.data._id,
          orderNumber: res.data._id?.slice(-6).toUpperCase() || 'EL-' + Date.now().toString(36).toUpperCase(),
          total: grand,
          address: addr,
          items: orderItems,
          paymentMethod,
        },
      });
    } catch (err) {
      console.error('Order Error:', err.response?.data);
      setError(err.response?.data?.msg || 'Order processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-[#060606] border border-[#333] text-[#f5f5f0] text-xs font-mono tracking-wider px-4 py-3.5 placeholder:text-[#666] outline-none focus:border-[#999] transition-colors";

  if (!items.length) {
    navigate('/cart');
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#060606] pt-24 pb-16"
    >
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 border-b border-[#333] pb-6">
          <div>
            <p className="text-[10px] font-mono tracking-[0.3em] text-[#666] mb-1">
              {step === 'shipping' ? 'STEP 01 / 02' : 'STEP 02 / 02'}
            </p>
            <h1 className="text-4xl font-light text-[#f5f5f0]">
              {step === 'shipping' ? 'SHIPPING INFO' : 'PAYMENT'}
            </h1>
          </div>
          <button
            onClick={() => (step === 'payment' ? setStep('shipping') : navigate('/cart'))}
            className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-[#999] hover:text-[#f5f5f0] transition-colors"
          >
            <ArrowLeft size={14} /> {step === 'payment' ? 'EDIT SHIPPING' : 'BACK TO CART'}
          </button>
        </div>

        {/* Guest Checkout Notice */}
        {!user && (
          <div className="mb-6 bg-[#1a1a1a] border border-[#333] p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono tracking-[0.2em] text-[#999]">CHECKING OUT AS GUEST</p>
              <p className="text-[10px] text-[#666] mt-1">Already have an account? <button onClick={() => navigate('/auth')} className="text-[#f5f5f0] hover:underline">Sign in</button></p>
            </div>
          </div>
        )}

        {/* Steps Indicator */}
        <div className="flex items-center gap-4 mb-12">
          {['SHIPPING', 'PAYMENT'].map((s, i) => (
            <div key={s} className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 ${
                  (i === 0 && step === 'shipping') || (i === 1 && step === 'payment')
                    ? 'text-[#f5f5f0]'
                    : 'text-[#666]'
                }`}
              >
                <div
                  className={`w-6 h-6 border flex items-center justify-center text-[10px] font-mono ${
                    (i === 0 && step === 'shipping') || (i === 1 && step === 'payment')
                      ? 'border-[#f5f5f0] bg-white/5'
                      : i === 0 && step === 'payment'
                      ? 'border-green-500/50 bg-green-500/10 text-green-400'
                      : 'border-[#333]'
                  }`}
                >
                  {i === 0 && step === 'payment' ? '✓' : `0${i + 1}`}
                </div>
                <span className="text-[10px] font-mono tracking-[0.2em]">{s}</span>
              </div>
              {i < 1 && <div className="w-12 h-px bg-[#333]" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Form */}
          <div>
            {step === 'shipping' ? (
              <motion.form
                key="shipping"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!addr.fullName || !addr.email || !addr.street || !addr.city || !addr.zipCode || !addr.phone) {
                    setError('Please fill in all shipping fields');
                    return;
                  }
                  if (!addr.email.includes('@')) {
                    setError('Please enter a valid email address');
                    return;
                  }
                  setError('');
                  setStep('payment');
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-mono tracking-[0.3em] text-[#666] mb-2">
                      FULL NAME *
                    </label>
                    <input
                      required
                      value={addr.fullName}
                      onChange={(e) => setAddr({ ...addr, fullName: e.target.value })}
                      placeholder="John Doe"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono tracking-[0.3em] text-[#666] mb-2">
                      PHONE *
                    </label>
                    <input
                      required
                      value={addr.phone}
                      onChange={(e) => setAddr({ ...addr, phone: e.target.value })}
                      placeholder="+92 300 0000000"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-mono tracking-[0.3em] text-[#666] mb-2">
                    EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    value={addr.email}
                    onChange={(e) => setAddr({ ...addr, email: e.target.value })}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono tracking-[0.3em] text-[#666] mb-2">
                    STREET ADDRESS *
                  </label>
                  <input
                    required
                    value={addr.street}
                    onChange={(e) => setAddr({ ...addr, street: e.target.value })}
                    placeholder="123 Main Street"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[9px] font-mono tracking-[0.3em] text-[#666] mb-2">
                      CITY *
                    </label>
                    <input
                      required
                      value={addr.city}
                      onChange={(e) => setAddr({ ...addr, city: e.target.value })}
                      placeholder="Karachi"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono tracking-[0.3em] text-[#666] mb-2">
                      ZIP CODE *
                    </label>
                    <input
                      required
                      value={addr.zipCode}
                      onChange={(e) => setAddr({ ...addr, zipCode: e.target.value })}
                      placeholder="75500"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono tracking-[0.3em] text-[#666] mb-2">
                      COUNTRY
                    </label>
                    <select
                      value="PK"
                      className={inputClass + ' appearance-none'}
                    >
                      <option value="PK" className="bg-[#060606]">Pakistan</option>
                      <option value="US" className="bg-[#060606]">United States</option>
                      <option value="GB" className="bg-[#060606]">United Kingdom</option>
                      <option value="AE" className="bg-[#060606]">UAE</option>
                      <option value="DE" className="bg-[#060606]">Germany</option>
                      <option value="JP" className="bg-[#060606]">Japan</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <p className="text-xs font-mono text-red-400 border border-red-500/20 bg-red-500/5 px-4 py-3">
                    {error}
                  </p>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-[#f5f5f0] text-[#060606] text-xs font-mono tracking-[0.2em] py-4 hover:bg-[#ccc] transition-colors mt-6"
                >
                  CONTINUE TO PAYMENT
                </motion.button>
              </motion.form>
            ) : (
              <motion.form
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handlePayment}
                className="space-y-6"
              >
                {/* Payment Method Selection */}
                <div>
                  <label className="block text-[10px] font-mono tracking-[0.2em] text-[#666] mb-4">
                    SELECT PAYMENT METHOD
                  </label>
                  <div className="space-y-3">
                    {[
                      { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={16} />, desc: 'Pay securely with Visa, Mastercard, or Amex' },
                      { id: 'cod', label: 'Cash on Delivery', icon: <Banknote size={16} />, desc: 'Pay when your order arrives' },
                      { id: 'bank', label: 'Bank Transfer', icon: <Wallet size={16} />, desc: 'Direct bank transfer (order ships after payment)' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPaymentMethod(opt.id)}
                        className={`w-full flex items-center gap-4 p-4 border transition-all ${
                          paymentMethod === opt.id
                            ? 'border-[#f5f5f0] bg-white/5'
                            : 'border-[#333] hover:border-[#999]'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === opt.id
                              ? 'border-[#f5f5f0]'
                              : 'border-[#666]'
                          }`}
                        >
                          {paymentMethod === opt.id && (
                            <div className="w-2.5 h-2.5 bg-[#f5f5f0] rounded-full" />
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span
                              className={
                                paymentMethod === opt.id
                                  ? 'text-[#f5f5f0]'
                                  : 'text-[#999]'
                              }
                            >
                              {opt.icon}
                            </span>
                            <span
                              className={`text-sm ${
                                paymentMethod === opt.id
                                  ? 'text-[#f5f5f0]'
                                  : 'text-[#999]'
                              }`}
                            >
                              {opt.label}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#666] mt-0.5">{opt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Details */}
                <AnimatePresence>
                  {paymentMethod === 'card' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="border border-amber-500/20 bg-amber-500/5 p-4 flex gap-3">
                        <AlertCircle size={14} className="text-amber-400 flex-none mt-0.5" />
                        <div>
                          <p className="text-xs font-mono tracking-wider text-amber-400 mb-1">DEMO MODE</p>
                          <p className="text-xs text-[#999]">Use test card: 4242 4242 4242 4242</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono tracking-[0.3em] text-[#666] mb-2">
                          CARDHOLDER NAME
                        </label>
                        <input
                          required
                          value={card.name}
                          onChange={(e) => setCard({ ...card, name: e.target.value })}
                          placeholder="Name on card"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono tracking-[0.3em] text-[#666] mb-2">
                          CARD NUMBER
                        </label>
                        <div className="relative">
                          <input
                            required
                            value={card.number}
                            onChange={(e) => setCard({ ...card, number: e.target.value })}
                            placeholder="4242 4242 4242 4242"
                            className={inputClass + ' pr-12'}
                          />
                          <CreditCard size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666]" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-mono tracking-[0.3em] text-[#666] mb-2">
                            EXPIRY
                          </label>
                          <input
                            required
                            value={card.expiry}
                            onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                            placeholder="MM/YY"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono tracking-[0.3em] text-[#666] mb-2">
                            CVV
                          </label>
                          <input
                            required
                            value={card.cvv}
                            onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                            placeholder="123"
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* COD Info */}
                <AnimatePresence>
                  {paymentMethod === 'cod' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border border-[#333] bg-[#1a1a1a] p-4 overflow-hidden"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Truck size={16} className="text-[#999]" />
                        <span className="text-xs text-[#f5f5f0]">Cash on Delivery</span>
                      </div>
                      <p className="text-xs text-[#999] leading-relaxed">
                        Pay with cash when your order is delivered. Please have exact amount ready.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bank Transfer Info */}
                <AnimatePresence>
                  {paymentMethod === 'bank' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border border-[#333] bg-[#1a1a1a] p-4 overflow-hidden"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Wallet size={16} className="text-[#999]" />
                        <span className="text-xs text-[#f5f5f0]">Bank Transfer</span>
                      </div>
                      <p className="text-xs text-[#999] leading-relaxed mb-3">
                        After placing your order, you will receive bank details via email. Order ships once payment is confirmed.
                      </p>
                      <div className="bg-[#060606] p-3 border border-[#333]">
                        <p className="text-[10px] font-mono text-[#666]">BANK: ELARA BANK</p>
                        <p className="text-[10px] font-mono text-[#666]">ACCOUNT: 1234-5678-9012</p>
                        <p className="text-[10px] font-mono text-[#666]">REFERENCE: Your order number</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <p className="text-xs font-mono text-red-400 border border-red-500/20 bg-red-500/5 px-4 py-3">
                    {error}
                  </p>
                )}

                <motion.button
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 py-4 text-xs font-mono tracking-[0.2em] transition-all ${
                    loading
                      ? 'bg-[#333] text-[#666]'
                      : 'bg-[#f5f5f0] text-[#060606] hover:bg-[#ccc]'
                  }`}
                >
                  <Lock size={12} />
                  {loading ? 'PROCESSING...' : `PLACE ORDER — $${grand.toFixed(2)}`}
                </motion.button>

                <div className="flex items-center justify-center gap-2">
                  <Lock size={10} className="text-[#666]" />
                  <span className="text-[9px] font-mono tracking-widest text-[#666]">
                    SSL SECURED — 256-BIT ENCRYPTION
                  </span>
                </div>
              </motion.form>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-[#1a1a1a] border border-[#333] p-6 h-fit sticky top-24">
            <p className="text-[10px] font-mono tracking-[0.3em] text-[#666] mb-6">YOUR ORDER</p>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="flex gap-3">
                  <div className="w-14 h-14 flex-none overflow-hidden border border-[#333]">
                    <img
                      src={`${item.product.images?.[0] || item.product.image || ''}?auto=compress&cs=tinysrgb&w=100`}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-light text-[#f5f5f0] truncate">{item.product.name}</p>
                    <p className="text-[9px] font-mono text-[#666] mt-0.5">{item.size} × {item.quantity}</p>
                  </div>
                  <span className="text-xs font-light text-[#f5f5f0] flex-none">
                    ${(item.product.price * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#333] pt-4 space-y-2">
              <div className="flex justify-between text-xs text-[#999]">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-[#999]">
                <span>Tax (10%)</span>
                <span>${TAX.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-[#999]">
                <span>Shipping</span>
                <span>${SHIP.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#333]">
                <span className="text-xs font-mono tracking-[0.15em] text-[#f5f5f0]">TOTAL</span>
                <span className="text-lg font-light text-[#f5f5f0]">${grand.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}