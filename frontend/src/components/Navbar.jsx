import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const scrollTo = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  // ✅ SIMPLE ENGLISH NAVIGATION (Easy to understand)
  const navLinks = [
    { label: 'Our Vision', id: 'hero' },        // VISION → Our Vision
    { label: 'Products', id: 'catalog' },       // ESTORE → Products
    { label: 'Design', id: 'anatomy' },         // ANATOMY → Design
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-[#060606]/95 backdrop-blur-xl border-b border-[#323230]' : 'bg-transparent'
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 border border-white/60 flex items-center justify-center group-hover:border-white transition-colors">
              <span className="text-xs font-mono font-bold text-white group-hover:text-white">E</span>
            </div>
            <span className="hidden sm:block text-sm font-mono tracking-[0.2em] text-[#f5f5f0] group-hover:text-white transition-colors">
              ELARA FOOTWEAR
            </span>
          </Link>

          {/* Desktop Navigation - SIMPLE ENGLISH */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ label, id }) => (
              <button
                key={label}
                onClick={() => scrollTo(id)}
                className="relative text-xs font-mono tracking-[0.2em] text-[#999997] hover:text-white transition-colors group"
              >
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                {isAdmin && (
                  <Link to="/admin" className="text-[#999997] hover:text-white transition-colors">
                    <Settings size={16} />
                  </Link>
                )}
                <Link to="/profile" className="text-[#999997] hover:text-white transition-colors">
                  <User size={16} />
                </Link>
                <button onClick={signOut} className="text-[#999997] hover:text-white transition-colors">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="hidden md:block text-xs font-mono tracking-[0.15em] text-[#999997] hover:text-white transition-colors">
                Sign In
              </Link>
            )}

            <Link to="/cart" className="relative group">
              <ShoppingCart size={20} className="text-[#f5f5f0] group-hover:text-white transition-colors" />
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-4 h-4 bg-white text-[#060606] text-[9px] font-mono font-bold rounded-full flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-[#f5f5f0] hover:text-white transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - SIMPLE ENGLISH */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-[#060606]/98 backdrop-blur-xl flex flex-col pt-20 px-8"
          >
            <div className="flex flex-col gap-8 mt-8">
              {navLinks.map(({ label, id }) => (
                <button
                  key={label}
                  onClick={() => scrollTo(id)}
                  className="text-left text-2xl font-mono tracking-[0.25em] text-[#f5f5f0] hover:text-white transition-colors"
                >
                  {label}
                </button>
              ))}
              <div className="border-t border-[#323230] pt-8 flex flex-col gap-4">
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-left text-sm font-mono tracking-widest text-[#999997] hover:text-white transition-colors">
                      Profile
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-left text-sm font-mono tracking-widest text-[#999997] hover:text-white transition-colors">
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        signOut();
                        setMenuOpen(false);
                      }}
                      className="text-left text-sm font-mono tracking-widest text-[#999997] hover:text-white transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setMenuOpen(false)} className="text-left text-sm font-mono tracking-widest text-[#999997] hover:text-white transition-colors">
                    Sign In / Register
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}