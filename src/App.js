import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { cartAPI, ordersAPI, CATEGORIES } from './services/api';
import { tokenManager, userManager } from './services/authAPI';
import { useTranslation } from './i18n/LanguageContext';

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
    const existingItem = cart.find(item => item.id === (book._id || book.id));

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: book._id || book.id,
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

function App() {
  const { t } = useTranslation();
  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
  }, [t]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Multiple loading states for different operations
  const [loadingStates, setLoadingStates] = useState({
    cart: false,
    addToCart: false,
    placeOrder: false,
    auth: false,
  });

  const userId = user?.id || user?._id || null;
  const isGuest = !user;

  // Helper to update specific loading state
  const setLoading = (key, value) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  };

  const handleLogout = useCallback(() => {
    tokenManager.removeToken();
    userManager.removeUser();
    setUser(null);

    // Clear authenticated cart, load guest cart
    const guestCart = guestCartManager.getCart();
    setCart(guestCart);

    // use the ref so handleLogout identity doesn't change when `t` function changes
    toast.info(tRef.current('toast.loggedOut'));
  }, []);

  // 401 Error Handler - Auto logout on auth errors
  const handle401Error = useCallback((error) => {
    const sessionExpiredMessage = tRef.current('auth.sessionExpired');
    if (error.message.includes('401') ||
      error.message.toLowerCase().includes('unauthorized') ||
      error.message.toLowerCase().includes('token')) {
      toast.error(sessionExpiredMessage);
      handleLogout();
      return true;
    }
    return false;
  }, [handleLogout]);

  useEffect(() => {
    const savedUser = userManager.getUser();
    if (savedUser && tokenManager.isAuthenticated()) {
      setUser(savedUser);
    }
    setIsInitialized(true);
  }, []);

  // (Route watching removed — not needed after moving books fetching into Home)

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
        setLoading('cart', true);
        const response = await cartAPI.get(userId);

        if (response.data && response.data.items && isMounted) {
          const transformedCart = response.data.items.map(item => ({
            id: item.book._id || item.book,
            title: item.book.title,
            author: item.book.author,
            price: item.price,
            quantity: item.quantity,
            image: item.book.coverImage || item.book.image,
            category: item.book.category,
          }));
          setCart(transformedCart);
        }
      } catch (err) {
        if (isMounted && !handle401Error(err)) {
          console.error('Error fetching cart:', err);
          toast.error('Failed to load cart');
          setCart([]);
        }
      } finally {
        if (isMounted) {
          setLoading('cart', false);
        }
      }
    };

    loadCart();

    return () => {
      isMounted = false;
    };
  }, [user, userId, isGuest, handle401Error]);

  const cartMergedMessage = t('cart.cartMerged');
  const migrateGuestCart = async (userId) => {
    const guestCart = guestCartManager.getCart();

    if (guestCart.length === 0) return;

    try {
      for (const item of guestCart) {
        await cartAPI.addItem(userId, item.id, item.quantity);
      }

      guestCartManager.clearCart();
      const response = await cartAPI.get(userId);
      if (response.data && response.data.items) {
        const transformedCart = response.data.items.map(item => ({
          id: item.book._id || item.book,
          title: item.book.title,
          author: item.book.author,
          price: item.price,
          quantity: item.quantity,
          image: item.book.coverImage || item.book.image,
          category: item.book.category,
        }));
        setCart(transformedCart);
      }

      toast.success(cartMergedMessage);
    } catch (err) {
      console.error('Error migrating cart:', err);
      toast.error('Failed to merge cart items');
    }
  };

  const addedToCart = t('toast.addedToCart');
  const addToCart = async (book, quantity) => {
    try {
      setLoading('addToCart', true);

      // Guest cart
      if (isGuest) {
        const updatedCart = guestCartManager.addItem(book, quantity);
        setCart(updatedCart);
        toast.success(addedToCart);
        return;
      }

      // Authenticated cart
      await cartAPI.addItem(userId, book._id || book.id, quantity);

      // Refresh from server
      const response = await cartAPI.get(userId);
      if (response.data && response.data.items) {
        const transformedCart = response.data.items.map(item => ({
          id: item.book._id || item.book,
          title: item.book.title,
          author: item.book.author,
          price: item.price,
          quantity: item.quantity,
          image: item.book.coverImage || item.book.image,
          category: item.book.category,
        }));
        setCart(transformedCart);
      }

      toast.success(addedToCart);
    } catch (err) {
      if (!handle401Error(err)) {
        // setError(err.message);
        toast.error(`Failed to add to cart: ${err.message}`);
        throw err;
      }
    } finally {
      setLoading('addToCart', false);
    }
  };

  const itemRemoved = t('cart.itemRemoved');
  const updateCartQuantity = async (bookId, newQuantity) => {
    try {
      if (isGuest) {
        const updatedCart = guestCartManager.updateItem(bookId, newQuantity);
        setCart(updatedCart);

        if (newQuantity <= 0) {
          toast.info(itemRemoved);
        }
        return;
      }

      if (newQuantity <= 0) {
        await cartAPI.removeItem(userId, bookId);
        toast.info(itemRemoved);
      } else {
        await cartAPI.updateItem(userId, bookId, newQuantity);
      }

      const response = await cartAPI.get(userId);
      if (response.data && response.data.items) {
        const transformedCart = response.data.items.map(item => ({
          id: item.book._id || item.book,
          title: item.book.title,
          author: item.book.author,
          price: item.price,
          quantity: item.quantity,
          image: item.book.coverImage || item.book.image,
          category: item.book.category,
        }));
        setCart(transformedCart);
      }
    } catch (err) {
      if (!handle401Error(err)) {
        // setError(err.message);
        toast.error('Failed to update cart');
      }
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const placeOrder = async (shippingAddress, paymentMethod) => {
    if (isGuest) {
      toast.warning('Please login to place an order');
      throw new Error('Please login to place an order');
    }

    try {
      setLoading('placeOrder', true);

      const orderData = {
        userId: userId,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod || 'Credit Card',
      };

      const response = await ordersAPI.place(orderData);

      // Clear cart after successful order
      setCart([]);

      // Clear server cart
      try {
        await cartAPI.clear(userId);
      } catch (err) {
        console.error('Failed to clear cart:', err);
      }

      toast.success('Order placed successfully!');
      return response.data;
    } catch (err) {
      if (!handle401Error(err)) {
        // setError(err.message);
        toast.error(`Failed to place order: ${err.message}`);
        throw err;
      }
    } finally {
      setLoading('placeOrder', false);
    }
  };

  // Handle successful login/register
  const handleUserLogin = async (userData) => {
    setUser(userData);

    // Migrate guest cart to user cart
    const userId = userData.id || userData._id;
    await migrateGuestCart(userId);
  };

  // Pagination for books is handled inside the Home page component now.

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Route watcher removed; Home handles its own fetching */}

      {!isInitialized ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg font-semibold text-gray-600">Loading...</div>
        </div>
      ) : (
        <Routes>
        <Route
          path="/"
          element={
            <Home
              cart={cart}
              setSelectedBook={setSelectedBook}
              categories={CATEGORIES}
              user={user}
              onLogout={handleLogout}
              handle401Error={handle401Error}
            />
          }
        />

        <Route
          path="/book/:bookId"
          element={
            <BookDetail
              book={selectedBook}
              cart={cart}
              addToCart={addToCart}
              loading={loadingStates.addToCart}
              user={user}
              onLogout={handleLogout}
            />
          }
        />

        <Route
          path="/checkout"
          element={
            <Checkout
              cart={cart}
              updateCartQuantity={updateCartQuantity}
              getTotalPrice={getTotalPrice}
              placeOrder={placeOrder}
              loading={loadingStates.placeOrder}
              userId={userId}
              user={user}
              isGuest={isGuest}
            />
          }
        />

        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Login
                setUser={handleUserLogin}
                loading={loadingStates.auth}
                setLoading={(val) => setLoading('auth', val)}
              />
            )
          }
        />

        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Register
                setUser={handleUserLogin}
                loading={loadingStates.auth}
                setLoading={(val) => setLoading('auth', val)}
              />
            )
          }
        />

        <Route
          path="/profile"
          element={
            user ? (
              <Profile
                user={user}
                setUser={setUser}
                cart={cart}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/orders"
          element={
            user ? (
              <Orders
                cart={cart}
                user={user}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;