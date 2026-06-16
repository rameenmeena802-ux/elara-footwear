import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLoading(true);

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setLocalError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!isLogin && password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    let result;
    if (isLogin) {
      result = await signIn(email, password);
    } else {
      result = await signUp(name, email, password);
    }

    if (result.error) {
      setLocalError(result.error);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-[#060606] flex items-center justify-center pt-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#1a1a1a] border border-[#333] p-8"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 border border-white/60 flex items-center justify-center mx-auto mb-4">
            <span className="text-xl font-mono font-bold text-white">E</span>
          </div>
          <h1 className="text-2xl font-light text-white tracking-wide">
            {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </h1>
          <p className="text-xs font-mono tracking-[0.2em] text-[#666] mt-2">
            {isLogin ? 'WELCOME BACK' : 'JOIN ELARA FOOTWEAR'}
          </p>
        </div>

        {displayError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono px-4 py-3 mb-6">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-mono tracking-[0.2em] text-[#666] mb-2">
                FULL NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#060606] border border-[#333] text-white text-sm px-4 py-3 outline-none focus:border-[#999] transition-colors"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono tracking-[0.2em] text-[#666] mb-2">
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#060606] border border-[#333] text-white text-sm px-4 py-3 outline-none focus:border-[#999] transition-colors"
              placeholder="admin@elara.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono tracking-[0.2em] text-[#666] mb-2">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-[#060606] border border-[#333] text-white text-sm px-4 py-3 outline-none focus:border-[#999] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-[10px] font-mono tracking-[0.2em] text-[#666] mb-2">
                CONFIRM PASSWORD
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-[#060606] border border-[#333] text-white text-sm px-4 py-3 outline-none focus:border-[#999] transition-colors"
                placeholder="Confirm password"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-[#060606] py-4 text-xs font-mono tracking-[0.2em] hover:bg-[#ccc] transition-colors disabled:opacity-50"
          >
            {loading ? 'PROCESSING...' : isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setLocalError('');
            }}
            className="text-xs font-mono tracking-[0.15em] text-[#666] hover:text-white transition-colors"
          >
            {isLogin ? "DON'T HAVE AN ACCOUNT? SIGN UP" : "ALREADY HAVE AN ACCOUNT? SIGN IN"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}