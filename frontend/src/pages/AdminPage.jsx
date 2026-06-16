import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Package, ShoppingBag, ChevronDown, ChevronUp, CreditCard, User, Mail, MapPin, Phone, Truck, DollarSign, TrendingUp, Clock, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const STATUS_OPTIONS = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  paid: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  shipped: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const PAYMENT_METHODS = {
  card: { label: 'Credit/Debit Card', icon: <CreditCard size={14} /> },
  cod: { label: 'Cash on Delivery', icon: <DollarSign size={14} /> },
  bank: { label: 'Bank Transfer', icon: <Truck size={14} /> },
};

const emptyForm = { name: '', price: '', category: 'Performance', description: '', stock: '', image: '', sku: '' };

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Check admin access
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadData();
  }, [user, isAdmin, navigate]);

  const loadData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        api.get('/products'),
        api.get('/orders/my-orders')
      ]);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const productData = {
      name: form.name,
      price: parseFloat(form.price),
      category: form.category,
      description: form.description,
      stock: parseInt(form.stock),
      sku: form.sku || `EL-${Date.now().toString(36).toUpperCase()}`,
      images: form.image ? [form.image] : ['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg'],
      colors: ['Black', 'White', 'Red'],
      sizes: ['39','40','41','42','43','44','45'],
      inStock: parseInt(form.stock) > 0
    };

    try {
      if (editId) {
        await api.put(`/products/${editId}`, productData);
        setMsg('PRODUCT UPDATED');
      } else {
        await api.post('/products', productData);
        setMsg('PRODUCT ADDED');
      }
      setShowForm(false);
      setEditId(null);
      setForm(emptyForm);
      loadData();
    } catch (err) {
      setMsg('Error: ' + (err.response?.data?.msg || 'Something went wrong'));
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description || '',
      stock: product.stock.toString(),
      image: product.images?.[0] || '',
      sku: product.sku || ''
    });
    setEditId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      setMsg('Error deleting product');
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleOrderStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const lowStock = products.filter(p => p.stock < 10).length;

  const inputClass = "w-full bg-[#060606] border border-[#333] text-[#f5f5f0] text-xs font-mono tracking-wider px-4 py-3 placeholder:text-[#666] outline-none focus:border-[#999] transition-colors";

  if (!user || !isAdmin) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#060606] pt-24 pb-16">
      <div className="max-w-screen-xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-10 border-b border-[#333] pb-6">
          <div>
            <p className="text-[10px] font-mono tracking-[0.3em] text-[#666] mb-1">ADMIN CONTROL CENTER</p>
            <h1 className="text-4xl font-light text-[#f5f5f0]">SYSTEM PANEL</h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono tracking-[0.2em] text-[#666]">ELARA FOOTWEAR</p>
            <p className="text-xs text-[#999]">Admin Mode</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0.5 mb-8">
          {[
            ['dashboard', TrendingUp, 'DASHBOARD'],
            ['products', ShoppingBag, 'PRODUCTS'],
            ['orders', Package, 'ORDERS']
          ].map(([id, Icon, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-6 py-3 text-xs font-mono tracking-[0.15em] transition-all ${
                tab === id
                  ? 'bg-[#f5f5f0] text-[#060606]'
                  : 'border border-[#333] text-[#999] hover:text-[#f5f5f0] hover:border-[#999]'
              }`}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        {/* Message */}
        {msg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-xs font-mono text-green-400 border border-green-500/20 bg-green-500/5 px-4 py-3 flex items-center gap-2"
          >
            <Check size={14} /> {msg}
          </motion.div>
        )}

        {/* Dashboard Tab */}
        {tab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                [DollarSign, 'TOTAL REVENUE', `$${totalRevenue.toFixed(2)}`, 'text-green-400'],
                [Package, 'TOTAL ORDERS', orders.length.toString(), 'text-blue-400'],
                [Clock, 'PENDING', pendingOrders.toString(), pendingOrders > 0 ? 'text-amber-400' : 'text-[#999]'],
                [AlertCircle, 'LOW STOCK', lowStock.toString(), lowStock > 0 ? 'text-red-400' : 'text-green-400'],
              ].map(([Icon, label, value, color], i) => (
                <div key={i} className="bg-[#1a1a1a] border border-[#333] p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon size={14} className="text-[#666]" />
                    <p className="text-[9px] font-mono tracking-[0.2em] text-[#666]">{label}</p>
                  </div>
                  <p className={`text-2xl font-light ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#1a1a1a] border border-[#333] p-6">
              <p className="text-[10px] font-mono tracking-[0.2em] text-[#666] mb-4">RECENT ORDERS</p>
              {orders.length === 0 ? (
                <p className="text-[#666] text-xs">No orders yet. Orders appear after checkout.</p>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 5).map(order => (
                    <div key={order._id} className="flex items-center justify-between py-2 border-b border-[#333] last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-[#999]">#{order._id?.slice(-6).toUpperCase()}</span>
                        <span className="text-xs text-[#f5f5f0]">${order.total.toFixed(2)}</span>
                      </div>
                      <span className={`text-[9px] font-mono px-2 py-1 border ${STATUS_COLORS[order.status] || 'text-[#999] border-[#333]'}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {tab === 'products' && (
          <div>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}
                className="flex items-center gap-2 bg-[#f5f5f0] text-[#060606] text-xs font-mono tracking-[0.15em] px-6 py-3 hover:bg-[#ccc] transition-colors"
              >
                <Plus size={13} /> ADD PRODUCT
              </button>
            </div>

            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#1a1a1a] border border-[#333] p-6 mb-8 overflow-hidden"
                >
                  <p className="text-[10px] font-mono tracking-[0.3em] text-[#666] mb-6">
                    {editId ? 'EDIT PRODUCT' : 'NEW PRODUCT'}
                  </p>
                  <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[9px] font-mono tracking-widest text-[#666] mb-2">NAME *</label>
                      <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputClass} placeholder="Product name" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono tracking-widest text-[#666] mb-2">SKU</label>
                      <input value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} className={inputClass} placeholder="Auto-generated" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono tracking-widest text-[#666] mb-2">PRICE (USD) *</label>
                      <input required type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className={inputClass} placeholder="0.00" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono tracking-widest text-[#666] mb-2">STOCK *</label>
                      <input required type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className={inputClass} placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono tracking-widest text-[#666] mb-2">CATEGORY *</label>
                      <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className={inputClass + ' appearance-none'}>
                        {['Performance','Lifestyle','Trail','Minimalist'].map(c => <option key={c} className="bg-[#060606]">{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono tracking-widest text-[#666] mb-2">IMAGE URL</label>
                      <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} className={inputClass} placeholder="https://..." />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className="block text-[9px] font-mono tracking-widest text-[#666] mb-2">DESCRIPTION</label>
                      <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className={inputClass + ' resize-none'} placeholder="Product description..." />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-3 flex gap-3">
                      <button type="submit" disabled={saving}
                        className="bg-[#f5f5f0] text-[#060606] text-xs font-mono tracking-[0.15em] px-8 py-3 hover:bg-[#ccc] transition-colors disabled:opacity-50">
                        {saving ? 'SAVING...' : editId ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
                      </button>
                      <button type="button" onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); }}
                        className="border border-[#333] text-[#999] text-xs font-mono tracking-[0.15em] px-6 py-3 hover:border-[#999] hover:text-[#f5f5f0] transition-all">
                        CANCEL
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {loading ? (
              <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-[#1a1a1a] animate-pulse" />)}</div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 border border-[#333] bg-[#1a1a1a]">
                <ShoppingBag size={32} className="text-[#666] mx-auto mb-4" />
                <p className="text-xs font-mono tracking-widest text-[#666]">NO PRODUCTS YET</p>
              </div>
            ) : (
              <div className="space-y-2">
                {products.map(p => (
                  <div key={p._id} className="bg-[#1a1a1a] border border-[#333] p-4 flex items-center gap-4 group hover:border-[#999] transition-colors">
                    <div className="w-16 h-16 flex-none overflow-hidden border border-[#333]">
                      <img
                        src={p.images?.[0] || 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=100'}
                        alt={p.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-light text-[#f5f5f0]">{p.name}</p>
                      <p className="text-[10px] font-mono text-[#666] mt-0.5">{p.sku || 'No SKU'} — {p.category}</p>
                      {p.description && <p className="text-[10px] text-[#999] mt-1 line-clamp-1">{p.description}</p>}
                    </div>
                    <div className="text-right px-4">
                      <p className="text-lg font-light text-[#f5f5f0]">${p.price.toFixed(2)}</p>
                      <p className="text-[9px] font-mono text-[#666]">PRICE</p>
                    </div>
                    <div className="text-right px-4 border-l border-[#333]">
                      <p className={`text-sm font-light ${p.stock > 10 ? 'text-green-400' : p.stock > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                        {p.stock}
                      </p>
                      <p className="text-[9px] font-mono text-[#666]">STOCK</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(p)} className="p-2.5 border border-[#333] text-[#999] hover:text-[#f5f5f0] hover:border-[#999] transition-colors">
                        <Edit2 size={12} />
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="p-2.5 border border-[#333] text-[#999] hover:text-red-400 hover:border-red-500/50 transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div className="space-y-3">
            {loading ? (
              [...Array(3)].map((_, i) => <div key={i} className="h-32 bg-[#1a1a1a] animate-pulse" />)
            ) : orders.length === 0 ? (
              <div className="text-center py-16 border border-[#333] bg-[#1a1a1a]">
                <Package size={32} className="text-[#666] mx-auto mb-4" />
                <p className="text-xs font-mono tracking-widest text-[#666]">NO ORDERS YET</p>
                <p className="text-[10px] text-[#999] mt-2">Orders will appear here after checkout</p>
              </div>
            ) : orders.map(order => {
              const isExpanded = expandedOrder === order._id;
              const paymentInfo = PAYMENT_METHODS[order.paymentMethod] || PAYMENT_METHODS.card;

              return (
                <motion.div key={order._id} layout className="bg-[#1a1a1a] border border-[#333] overflow-hidden">
                  <div
                    className="p-5 flex items-center gap-4 cursor-pointer hover:bg-[#060606] transition-colors"
                    onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-mono tracking-widest text-[#f5f5f0]">#{order._id?.slice(-6).toUpperCase()}</span>
                        <span className={`text-[9px] font-mono px-2 py-1 border ${STATUS_COLORS[order.status] || 'text-[#999] border-[#333]'}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#666]">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="text-right px-4">
                      <p className="text-lg font-light text-[#f5f5f0]">${order.total.toFixed(2)}</p>
                      <p className="text-[9px] font-mono text-[#666]">TOTAL</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-4 text-[#999]">
                      {paymentInfo.icon}
                      <span className="text-[9px] font-mono hidden sm:block">{paymentInfo.label}</span>
                    </div>
                    <div className="text-[#999]">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-[#333] overflow-hidden"
                      >
                        <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Customer Info */}
                          <div className="space-y-3">
                            <p className="text-[10px] font-mono tracking-[0.2em] text-[#666] mb-3">CUSTOMER</p>
                            <div className="flex items-start gap-2">
                              <User size={12} className="text-[#666] mt-0.5" />
                              <p className="text-xs text-[#f5f5f0]">{order.shippingAddress?.fullName || 'N/A'}</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <Mail size={12} className="text-[#666] mt-0.5" />
                              <p className="text-xs text-[#999]">{user?.email || 'N/A'}</p>
                            </div>
                            {order.shippingAddress?.phone && (
                              <div className="flex items-start gap-2">
                                <Phone size={12} className="text-[#666] mt-0.5" />
                                <p className="text-xs text-[#999]">{order.shippingAddress.phone}</p>
                              </div>
                            )}
                            <div className="flex items-start gap-2">
                              <MapPin size={12} className="text-[#666] mt-0.5" />
                              <p className="text-xs text-[#999]">{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div>
                            <p className="text-[10px] font-mono tracking-[0.2em] text-[#666] mb-3">ITEMS</p>
                            <div className="space-y-2">
                              {(order.items || []).map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 py-2 border-b border-[#333] last:border-0">
                                  <div className="w-10 h-10 bg-[#060606] overflow-hidden">
                                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs text-[#f5f5f0]">{item.name}</p>
                                    <p className="text-[9px] text-[#666]">Qty: {item.quantity} — {item.size}</p>
                                  </div>
                                  <p className="text-xs text-[#999]">${item.price?.toFixed(2)}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Payment & Status */}
                          <div className="space-y-4">
                            <div>
                              <p className="text-[10px] font-mono tracking-[0.2em] text-[#666] mb-3">PAYMENT</p>
                              <div className="bg-[#060606] border border-[#333] p-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <CreditCard size={14} className="text-[#999]" />
                                  <span className="text-xs text-[#f5f5f0]">{paymentInfo.label}</span>
                                </div>
                                <div className="flex justify-between text-[10px] mt-1">
                                  <span className="text-[#666]">Subtotal</span>
                                  <span className="text-[#999]">${order.total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[10px] mt-1">
                                  <span className="text-[#666]">Shipping</span>
                                  <span className="text-[#999]">$10.00</span>
                                </div>
                                <div className="flex justify-between text-xs mt-3 pt-2 border-t border-[#333]">
                                  <span className="text-[#f5f5f0]">Total</span>
                                  <span className="text-[#f5f5f0]">${order.total.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="text-[10px] font-mono tracking-[0.2em] text-[#666] mb-3">UPDATE STATUS</p>
                              <select
                                value={order.status}
                                onChange={e => handleOrderStatus(order._id, e.target.value)}
                                className="w-full bg-[#060606] border border-[#333] text-[#f5f5f0] text-xs font-mono px-4 py-3 outline-none appearance-none cursor-pointer"
                              >
                                {STATUS_OPTIONS.map(s => (
                                  <option key={s} value={s} className="bg-[#060606]">{s.toUpperCase()}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}