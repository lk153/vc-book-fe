import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { cartAPI } from '../api/cart';
import { useAuth } from './AuthContext';
import { useTranslation } from '../i18n/LanguageContext';
import { getId } from '../utils/getId';

const CartContext = createContext(null);

// Guest cart manager using localStorage
const guestCartManager = {
  getCart: () => {
    const cart = localStorage.getItem('guestCart');
    return cart ? JSON.parse(cart) : [];
  },

  setCart: (cart) => {
    localStorage.setItem('guestCart', JSON.stringify(cart));
  },

  clearCart: () => {
    localStorage.removeItem('guestCart');
  },

  addItem: (book, quantity) => {
    const cart = guestCartManager.getCart();
    const existingItem = cart.find(item => item.id === getId(book));

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: getId(book),
        title: book.title,
        author: book.author,
        price: book.price,
        quantity: quantity,
        image: book.coverImage || book.image,
        category: book.category,
      });
    }

    guestCartManager.setCart(cart);
    return cart;
  },

  updateItem: (bookId, newQuantity) => {
    let cart = guestCartManager.getCart();

    if (newQuantity <= 0) {
      cart = cart.filter(item => item.id !== bookId);
    } else {
      cart = cart.map(item =>
        item.id === bookId ? { ...item, quantity: newQuantity } : item
      );
    }

    guestCartManager.setCart(cart);
    return cart;
  }
};

// Transform API response to cart items
const transformCartItems = (items) => {
  return items.map(item => {
    // Handle both populated book object and book ID string
    const bookId = typeof item.book === 'string' ? item.book : getId(item.book);
    return {
      id: bookId,
      title: item.book.title || '',
      author: item.book.author || '',
      price: item.price,
      quantity: item.quantity,
      image: item.book.coverImage || item.book.image || '',
      category: item.book.category || '',
    };
  });
};

export function CartProvider({ children }) {
  const { t } = useTranslation();
  const tRef = useRef(t);

  useEffect(() => {
    tRef.current = t;
  }, [t]);

  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  const userId = user?.id || user?._id || null;
  const isGuest = !isAuthenticated;

  // Load cart on mount and when user changes
  useEffect(() => {
    let isMounted = true;

    const loadCart = async () => {
      if (!isMounted) return;

      if (isGuest) {
        const guestCart = guestCartManager.getCart();
        if (isMounted) setCart(guestCart);
        return;
      }

      try {
        setLoading(true);
        const response = await cartAPI.get(userId);

        if (response.data && response.data.items && isMounted) {
          setCart(transformCartItems(response.data.items));
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching cart:', err);
          toast.error('Failed to load cart');
          setCart([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCart();

    return () => {
      isMounted = false;
    };
  }, [user, userId, isGuest]);

  // Migrate guest cart to user cart on login
  const migrateGuestCart = useCallback(async (newUserId) => {
    const guestCart = guestCartManager.getCart();

    if (guestCart.length === 0) return;

    try {
      for (const item of guestCart) {
        await cartAPI.addItem(newUserId, item.id, item.quantity);
      }

      guestCartManager.clearCart();
      const response = await cartAPI.get(newUserId);
      if (response.data && response.data.items) {
        setCart(transformCartItems(response.data.items));
      }

      toast.success(tRef.current('cart.cartMerged'));
    } catch (err) {
      console.error('Error migrating cart:', err);
      toast.error('Failed to merge cart items');
    }
  }, []);

  // Add to cart
  const addToCart = useCallback(async (book, quantity) => {
    try {
      setAddToCartLoading(true);

      if (isGuest) {
        const updatedCart = guestCartManager.addItem(book, quantity);
        setCart(updatedCart);
        toast.success(tRef.current('toast.addedToCart'));
        return;
      }

      await cartAPI.addItem(userId, getId(book), quantity);

      const response = await cartAPI.get(userId);
      if (response.data && response.data.items) {
        setCart(transformCartItems(response.data.items));
      }

      toast.success(tRef.current('toast.addedToCart'));
    } catch (err) {
      toast.error(`Failed to add to cart: ${err.message}`);
      throw err;
    } finally {
      setAddToCartLoading(false);
    }
  }, [isGuest, userId]);

  // Update cart quantity
  const updateCartQuantity = useCallback(async (bookId, newQuantity) => {
    try {
      if (isGuest) {
        const updatedCart = guestCartManager.updateItem(bookId, newQuantity);
        setCart(updatedCart);

        if (newQuantity <= 0) {
          toast.info(tRef.current('cart.itemRemoved'));
        }
        return;
      }

      if (newQuantity <= 0) {
        await cartAPI.removeItem(userId, bookId);
        toast.info(tRef.current('cart.itemRemoved'));
      } else {
        await cartAPI.updateItem(userId, bookId, newQuantity);
      }

      const response = await cartAPI.get(userId);
      if (response.data && response.data.items) {
        setCart(transformCartItems(response.data.items));
      }
    } catch (err) {
      toast.error(t('cart.updateFailed'));
    }
  }, [isGuest, userId, t]);

  // Get total price
  const getTotalPrice = useCallback(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  }, [cart]);

  // Clear cart
  const clearCart = useCallback(async () => {
    if (isGuest) {
      guestCartManager.clearCart();
      setCart([]);
      return;
    }

    try {
      await cartAPI.clear(userId);
      setCart([]);
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  }, [isGuest, userId]);

  // Get guest cart for migration
  const getGuestCart = useCallback(() => {
    return guestCartManager.getCart();
  }, []);

  // Load guest cart (used after logout)
  const loadGuestCart = useCallback(() => {
    const guestCart = guestCartManager.getCart();
    setCart(guestCart);
  }, []);

  const value = {
    cart,
    loading,
    addToCartLoading,
    isGuest,
    addToCart,
    updateCartQuantity,
    getTotalPrice,
    clearCart,
    migrateGuestCart,
    getGuestCart,
    loadGuestCart,
    setCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
