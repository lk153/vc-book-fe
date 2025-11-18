// App.js
import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import BookDetailPage from './pages/BookDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import { booksAPI, cartAPI, ordersAPI, CATEGORIES } from './services/api';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Simulated user ID (in production, this would come from authentication)
  const userId = 'user123';

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await booksAPI.getAll({
        category: selectedCategory,
        limit: 50 // Adjust as needed
      });
      setBooks(response.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await cartAPI.get(userId);
      if (response.data && response.data.items) {
        // Transform cart items to match our component structure
        const transformedCart = response.data.items.map(item => ({
          id: item.book.id,
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
      // If cart doesn't exist, that's okay - start with empty cart
      setCart([]);
    }
  };

  // Fetch books on mount and when category changes
  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToCart = async (book, quantity) => {
    try {
      setLoading(true);
      await cartAPI.addItem(userId, book._id || book.id, quantity);
      
      // Update local cart state
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
      
      // Refresh cart from server
      await fetchCart();
    } catch (err) {
      setError(err.message);
      console.error('Error adding to cart:', err);
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
      await fetchCart();
    } catch (err) {
      setError(err.message);
      console.error('Error updating cart:', err);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const placeOrder = async (shippingAddress, paymentMethod) => {
    try {
      setLoading(true);
      const orderData = {
        userId: userId,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod || 'Credit Card',
      };
      
      const response = await ordersAPI.place(orderData);
      
      // Clear cart after successful order
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

  return (
    <>
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
        />
      )}
      {currentPage === 'detail' && selectedBook && (
        <BookDetailPage 
          book={selectedBook}
          cart={cart}
          addToCart={addToCart}
          setCurrentPage={setCurrentPage}
          loading={loading}
        />
      )}
      {currentPage === 'checkout' && (
        <CheckoutPage 
          books={books}
          cart={cart}
          updateCartQuantity={updateCartQuantity}
          getTotalPrice={getTotalPrice}
          setCurrentPage={setCurrentPage}
          placeOrder={placeOrder}
          loading={loading}
          userId={userId}
        />
      )}
    </>
  );
}

export default App;