import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (name, email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      console.log('Register Response:', res.data);

      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);
      return { error: null };
    } catch (err) {
      console.error('SignUp Error:', err.response?.data);
      const msg = err.response?.data?.msg || 'Registration failed';
      setError(msg);
      return { error: msg };
    }
  };

  const signIn = async (email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      console.log('Login Response:', res.data);

      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);
      return { error: null };
    } catch (err) {
      console.error('SignIn Error:', err.response?.data);
      const msg = err.response?.data?.msg || 'Login failed';
      setError(msg);
      return { error: msg };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const isAdmin = user?.email === 'admin@elara.com';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        signUp,
        signIn,
        signOut,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}