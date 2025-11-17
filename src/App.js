import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import BookDetailPage from './pages/BookDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import { booksData } from './data/booksData';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBook, setSelectedBook] = useState(null);
  const [cart, setCart] = useState([]);

  const addToCart = (book, quantity) => {
    const existingItem = cart.find(item => item.id === book.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === book.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...book, quantity }]);
    }
  };

  const updateCartQuantity = (bookId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.id !== bookId));
    } else {
      setCart(cart.map(item => 
        item.id === bookId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  return (
    <>
      {currentPage === 'home' && (
        <HomePage 
          booksData={booksData}
          cart={cart}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setCurrentPage={setCurrentPage}
          setSelectedBook={setSelectedBook}
        />
      )}
      {currentPage === 'detail' && selectedBook && (
        <BookDetailPage 
          book={selectedBook}
          cart={cart}
          addToCart={addToCart}
          setCurrentPage={setCurrentPage}
        />
      )}
      {currentPage === 'checkout' && (
        <CheckoutPage 
          cart={cart}
          updateCartQuantity={updateCartQuantity}
          getTotalPrice={getTotalPrice}
          setCurrentPage={setCurrentPage}
        />
      )}
    </>
  );
}

export default App;