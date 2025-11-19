import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import BookDetailPage from './pages/BookDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import { booksAPI, cartAPI, ordersAPI, CATEGORIES } from './services/api';
import { tokenManager, userManager } from './services/authAPI';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  
  // Get user ID (from logged in user or guest)
  const userId = user?.id || user?._id || 'guest';

  // Check if user is logged in on mount
  useEffect(() => {
    const savedUser = userManager.getUser();
    if (savedUser && tokenManager.isAuthenticated()) {
      setUser(savedUser);
    }
  }, []);

  // Fetch books on mount and when category changes
  useEffect(() => {
    let isMounted = true;
    
    const loadBooks = async () => {
      if (!isMounted) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await booksAPI.getAll({
          category: selectedCategory,
          limit: 50
        });
        if (isMounted) {
          setBooks(response.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error('Error fetching books:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBooks();

    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  // Fetch cart only when user logs in (not for guest)
  useEffect(() => {
    let isMounted = true;

    const loadCart = async () => {
      if (!user || userId === 'guest' || !isMounted) {
        if (isMounted) setCart([]);
        return;
      }

      try {
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
        console.error('Error fetching cart:', err);
        if (isMounted) setCart([]);
      }
    };

    loadCart();

    return () => {
      isMounted = false;
    };
  }, [user, userId]);

  const addToCart = async (book, quantity) => {
    // Check if user is logged in for cart operations
    if (!user) {
      alert('Please login to add items to cart');
      setCurrentPage('login');
      return;
    }

    try {
      setLoading(true);
      await cartAPI.addItem(userId, book._id || book.id, quantity);
      
      const existingItem = cart.find(item => item.id === (book._id || book.id));
      if (existingItem) {
        setCart(cart.map(item => 
          item.id === (book._id || book.id)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ));
      } else {
        setCart([...cart, {
          id: book._id || book.id,
          title: book.title,
          author: book.author,
          price: book.price,
          quantity: quantity,
          image: book.coverImage || book.image,
          category: book.category,
        }]);
      }
      
      // Refresh cart from server to ensure sync
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
      setError(err.message);
      console.error('Error adding to cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCartQuantity = async (bookId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        await cartAPI.removeItem(userId, bookId);
        setCart(cart.filter(item => item.id !== bookId));
      } else {
        await cartAPI.updateItem(userId, bookId, newQuantity);
        setCart(cart.map(item => 
          item.id === bookId ? { ...item, quantity: newQuantity } : item
        ));
      }
      
      // Refresh cart from server
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
      setError(err.message);
      console.error('Error updating cart:', err);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const placeOrder = async (shippingAddress, paymentMethod) => {
    // Check if user is logged in
    if (!user) {
      alert('Please login to place an order');
      setCurrentPage('login');
      throw new Error('Please login to place an order');
    }

    try {
      setLoading(true);
      const orderData = {
        userId: userId,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod || 'Credit Card',
      };
      
      const response = await ordersAPI.place(orderData);
      
      setCart([]);
      
      return response.data;
    } catch (err) {
      setError(err.message);
      console.error('Error placing order:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    tokenManager.removeToken();
    userManager.removeUser();
    setUser(null);
    setCart([]);
    setCurrentPage('home');
  };

  return (
    <>
      {currentPage === 'profile' && (
        <ProfilePage 
          user={user}
          setUser={setUser}
          cart={cart} 
          setCurrentPage={setCurrentPage}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'login' && (
        <LoginPage 
          setCurrentPage={setCurrentPage}
          setUser={setUser}
        />
      )}
      {currentPage === 'register' && (
        <RegisterPage 
          setCurrentPage={setCurrentPage}
          setUser={setUser}
        />
      )}
      {currentPage === 'home' && (
        <HomePage 
          books={books}
          cart={cart}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setCurrentPage={setCurrentPage}
          setSelectedBook={setSelectedBook}
          loading={loading}
          error={error}
          categories={CATEGORIES}
          user={user}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'detail' && selectedBook && (
        <BookDetailPage 
          book={selectedBook}
          cart={cart}
          addToCart={addToCart}
          setCurrentPage={setCurrentPage}
          loading={loading}
          user={user}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'checkout' && (
        <CheckoutPage 
          cart={cart}
          updateCartQuantity={updateCartQuantity}
          getTotalPrice={getTotalPrice}
          setCurrentPage={setCurrentPage}
          placeOrder={placeOrder}
          loading={loading}
          userId={userId}
          user={user}
        />
      )}
    </>
  );
}

export default App;