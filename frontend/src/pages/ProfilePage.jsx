import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Package, Key, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ProfilePage() {
  const { user, token, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState(user?.name || '');
  const [saveMsg, setSaveMsg] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwMsg, setPwMsg] = useState('');

  const STATUS_COLORS = {
    pending: 'text-amber-400 border-amber-400/30',
    paid: 'text-blue-400 border-blue-400/30',
    shipped: 'text-cyan-400 border-cyan-400/30',
    delivered: 'text-green-400 border-green-400/30',
    cancelled: 'text-red-400 border-red-400/30',
  };

  // Fetch orders
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  // Update profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/update-profile', { name: fullName });
      setSaveMsg('PROFILE UPDATED');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg('Error updating profile');
      setTimeout(() => setSaveMsg(''), 3000);
    }
  };

  // Change password
  const handleChangePw = async (e) => {
    e.preventDefault();
    if (newPw.length < 6) {
      setPwMsg('Min 6 characters.');
      return;
    }
    try {
      await api.put('/auth/change-password', { password: newPw });
      setPwMsg('PASSWORD UPDATED');
      setNewPw('');
      setTimeout(() => setPwMsg(''), 3000);
    } catch (err) {
      setPwMsg('Error: ' + (err.response?.data?.msg || 'Something went wrong'));
      setTimeout(() => setPwMsg(''), 3000);
    }
  };

  const tabs = [
    { id: 'orders', label: 'ORDERS', Icon: Package },
    { id: 'profile', label: 'PROFILE', Icon: User },
    { id: 'security', label: 'SECURITY', Icon: Key },
  ];

  const inputClass = "w-full bg-[#060606] border border-[#333] text-[#f5f5f0] text-xs font-mono tracking-wider px-4 py-3.5 placeholder:text-[#666] outline-none focus:border-[#999] transition-colors";

  if (!user) return null;

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
              MEMBER PORTAL
            </p>
            <h1 className="text-4xl font-light text-[#f5f5f0]">
              {user?.name || user?.email?.split('@')[0].toUpperCase() || 'ACCOUNT'}
            </h1>
            <p className="text-xs font-mono text-[#999] mt-1">{user?.email}</p>
          </div>
          <button
            onClick={() => { signOut(); navigate('/'); }}
            className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-[#999] hover:text-[#f5f5f0] transition-colors border border-[#333] px-4 py-2 hover:border-[#999]"
          >
            <LogOut size={13} /> SIGN OUT
          </button>
        </div>

        {/* Tabs + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
          {/* Sidebar Tabs */}
          <div className="space-y-0.5">
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-xs font-mono tracking-[0.2em] transition-all ${
                  tab === id
                    ? 'bg-white/5 border border-[#333] text-[#f5f5f0]'
                    : 'text-[#999] hover:text-[#f5f5f0] hover:bg-white/[0.02]'
                }`}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div>
            {/* Orders Tab */}
            {tab === 'orders' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-[10px] font-mono tracking-[0.3em] text-[#666] mb-6">
                  ORDER HISTORY
                </p>

                {loading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-24 bg-[#1a1a1a] animate-pulse" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16 border border-[#333] bg-[#1a1a1a]">
                    <Package size={32} className="text-[#666] mx-auto mb-4" />
                    <p className="text-xs font-mono tracking-widest text-[#666]">
                      NO ORDERS YET
                    </p>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {orders.map((order) => (
                      <div key={order._id} className="bg-[#1a1a1a] border border-[#333] p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-xs font-mono tracking-[0.2em] text-[#f5f5f0] mb-1">
                              #{order._id?.slice(-6).toUpperCase()}
                            </p>
                            <p className="text-[10px] font-mono text-[#666]">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span
                              className={`text-[9px] font-mono tracking-widest px-3 py-1 border ${
                                STATUS_COLORS[order.status] || 'text-[#999] border-[#333]'
                              }`}
                            >
                              {order.status.toUpperCase()}
                            </span>
                            <span className="text-lg font-light text-[#f5f5f0]">
                              ${order.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        {order.shippingAddress && (
                          <p className="text-[10px] font-mono text-[#666]">
                            SHIP TO: {order.shippingAddress.fullName}, {order.shippingAddress.city}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Profile Tab */}
            {tab === 'profile' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-[10px] font-mono tracking-[0.3em] text-[#666] mb-6">
                  PROFILE INFORMATION
                </p>
                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-[9px] font-mono tracking-[0.3em] text-[#666] mb-2">
                      FULL NAME
                    </label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="FULL NAME"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono tracking-[0.3em] text-[#666] mb-2">
                      EMAIL
                    </label>
                    <input
                      value={user?.email || ''}
                      disabled
                      className={inputClass + ' opacity-50 cursor-not-allowed'}
                    />
                  </div>
                  {saveMsg && (
                    <p className="text-xs font-mono text-green-400">{saveMsg}</p>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="bg-[#f5f5f0] text-[#060606] text-xs font-mono tracking-[0.2em] px-8 py-3 hover:bg-[#ccc] transition-colors"
                  >
                    SAVE CHANGES
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* Security Tab */}
            {tab === 'security' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-[10px] font-mono tracking-[0.3em] text-[#666] mb-6">
                  CHANGE PASSWORD
                </p>
                <form onSubmit={handleChangePw} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-[9px] font-mono tracking-[0.3em] text-[#666] mb-2">
                      NEW PASSWORD
                    </label>
                    <input
                      type="password"
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      placeholder="MIN 6 CHARACTERS"
                      required
                      className={inputClass}
                    />
                  </div>
                  {pwMsg && (
                    <p
                      className={`text-xs font-mono ${
                        pwMsg.includes('Error') ? 'text-red-400' : 'text-green-400'
                      }`}
                    >
                      {pwMsg}
                    </p>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="bg-[#f5f5f0] text-[#060606] text-xs font-mono tracking-[0.2em] px-8 py-3 hover:bg-[#ccc] transition-colors"
                  >
                    UPDATE PASSWORD
                  </motion.button>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}