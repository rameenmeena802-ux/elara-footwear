import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(undefined);
const CART_KEY = 'elara_cart';

// Load cart from localStorage
function loadCart() {
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  // Sync with backend when user logs in
  useEffect(() => {
    if (user && token) {
      syncCartWithBackend();
    }
  }, [user, token]);

  // Sync local cart with backend
  const syncCartWithBackend = async () => {
    try {
      setLoading(true);
      // Get cart from backend
      const res = await api.get('/cart');
      const backendCart = res.data;

      if (backendCart.items && backendCart.items.length > 0) {
        // If backend has items, use them (merge if needed)
        const mergedItems = mergeCarts(items, backendCart.items);
        setItems(mergedItems);
        localStorage.setItem(CART_KEY, JSON.stringify(mergedItems));
      } else if (items.length > 0) {
        // If local has items but backend doesn't, sync to backend
        await syncToBackend(items);
      }
    } catch (err) {
      console.error('Error syncing cart:', err);
    } finally {
      setLoading(false);
    }
  };

  // Merge local and backend carts
  const mergeCarts = (localItems, backendItems) => {
    const merged = [...backendItems];
    localItems.forEach((localItem) => {
      const exists = merged.find(
        (item) =>
          item.productId === localItem.productId &&
          item.size === localItem.size &&
          item.color === localItem.color
      );
      if (!exists) {
        merged.push(localItem);
      }
    });
    return merged;
  };

  // Sync local cart to backend
  const syncToBackend = async (cartItems) => {
    try {
      for (const item of cartItems) {
        await api.post('/cart/add', {
          productId: item.productId,
          name: item.product.name,
          price: item.product.price,
          size: item.size,
          quantity: item.quantity,
          image: item.product.images?.[0] || '',
        });
      }
    } catch (err) {
      console.error('Error syncing to backend:', err);
    }
  };

  // Add item to cart
  const addItem = async (product, size, color) => {
    // Check if item already exists
    const existing = items.find(
      (i) => i.productId === product._id && i.size === size && i.color === color
    );

    let newItems;
    if (existing) {
      newItems = items.map((i) =>
        i.productId === product._id && i.size === size && i.color === color
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
    } else {
      newItems = [
        ...items,
        {
          productId: product._id,
          product,
          size,
          color,
          quantity: 1,
        },
      ];
    }

    setItems(newItems);
    localStorage.setItem(CART_KEY, JSON.stringify(newItems));

    // Sync to backend if logged in
    if (user && token) {
      try {
        await api.post('/cart/add', {
          productId: product._id,
          name: product.name,
          price: product.price,
          size,
          quantity: 1,
          image: product.images?.[0] || '',
        });
      } catch (err) {
        console.error('Error adding to backend cart:', err);
      }
    }
  };

  // Remove item from cart
  const removeItem = async (productId, size, color) => {
    const newItems = items.filter(
      (i) => !(i.productId === productId && i.size === size && i.color === color)
    );
    setItems(newItems);
    localStorage.setItem(CART_KEY, JSON.stringify(newItems));

    // Sync to backend if logged in
    if (user && token) {
      try {
        // Find item in backend cart to get its ID
        const res = await api.get('/cart');
        const backendItems = res.data.items || [];
        const backendItem = backendItems.find(
          (item) =>
            item.productId === productId && item.size === size
        );
        if (backendItem && backendItem._id) {
          await api.delete(`/cart/remove/${backendItem._id}`);
        }
      } catch (err) {
        console.error('Error removing from backend cart:', err);
      }
    }
  };

  // Update quantity
  const updateQuantity = async (productId, size, color, quantity) => {
    if (quantity <= 0) {
      removeItem(productId, size, color);
      return;
    }

    const newItems = items.map((i) =>
      i.productId === productId && i.size === size && i.color === color
        ? { ...i, quantity }
        : i
    );
    setItems(newItems);
    localStorage.setItem(CART_KEY, JSON.stringify(newItems));

    // Sync to backend if logged in
    if (user && token) {
      try {
        const res = await api.get('/cart');
        const backendItems = res.data.items || [];
        const backendItem = backendItems.find(
          (item) =>
            item.productId === productId && item.size === size
        );
        if (backendItem && backendItem._id) {
          await api.put(`/cart/update/${backendItem._id}`, { quantity });
        }
      } catch (err) {
        console.error('Error updating backend cart:', err);
      }
    }
  };

  // Clear cart
  const clearCart = async () => {
    setItems([]);
    localStorage.removeItem(CART_KEY);

    if (user && token) {
      try {
        await api.delete('/cart/clear');
      } catch (err) {
        console.error('Error clearing backend cart:', err);
      }
    }
  };

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}