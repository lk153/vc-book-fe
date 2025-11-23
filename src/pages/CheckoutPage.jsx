// src/pages/CheckoutPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShoppingCart, Home, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import CartItem from '../components/CartItem';

export default function CheckoutPage({
  cart,
  updateCartQuantity,
  getTotalPrice,
  placeOrder,
  loading,
  userId,
  user,
  isGuest
}) {
  const navigate = useNavigate();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'VN',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [orderError, setOrderError] = useState(null);

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setOrderError(null);

    if (!shippingAddress.fullName || !shippingAddress.address ||
      !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.phone) {
      setOrderError('Please fill in all required fields');
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const order = await placeOrder(shippingAddress, paymentMethod);
      setOrderData(order);
      setOrderSuccess(true);
    } catch (err) {
      setOrderError(err.message || 'Failed to place order');
    }
  };

  // Order success screen
  if (orderSuccess && orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button
              onClick={() => {
                setOrderSuccess(false);
                navigate('/');
              }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Home size={20} />
              <span>Back to Home</span>
            </button>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-6">Thank you for your order</p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h2 className="font-bold text-lg mb-3">Order Details</h2>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Order Number:</span> {orderData.orderNumber}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Total:</span> ${orderData.summary?.total?.toFixed(2)}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Status:</span> {orderData.status}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Delivery Address:</span><br />
                {orderData.shippingAddress.address}, {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.postalCode}
              </p>
            </div>

            <button
              onClick={() => {
                setOrderSuccess(false);
                navigate('/');
              }}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Checkout form
  if (showOrderForm && cart.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button
              onClick={() => setShowOrderForm(false)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Home size={20} />
              <span>Back to Cart</span>
            </button>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Shipping Information</h1>

          {orderError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700">{orderError}</p>
            </div>
          )}

          <form onSubmit={handlePlaceOrder} className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={shippingAddress.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={shippingAddress.country}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
              </select>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">Order Total</span>
                <span className="text-2xl font-bold text-blue-600">${getTotalPrice()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Processing...
                </>
              ) : (
                'Place Order'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Cart view
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Home size={20} />
            <span>Continue Shopping</span>
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        {/* Guest Warning */}
        {isGuest && cart.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <p className="text-yellow-800 font-medium mb-1">Guest Cart</p>
              <p className="text-yellow-700 text-sm">
                You're browsing as a guest. Your cart is saved locally.
                <Link to="/login" className="font-medium underline ml-1">
                  Login
                </Link> to sync your cart and place orders.
              </p>
            </div>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some books to get started!</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Browse Books
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {cart.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  updateCartQuantity={updateCartQuantity}
                />
              ))}
            </div>

            <div className="bg-gray-50 p-6 border-t-2 border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <span className="text-2xl font-bold text-gray-800">Total</span>
                <span className="text-3xl font-bold text-blue-600">${getTotalPrice()}</span>
              </div>

              {isGuest ? (
                <Link
                  to="/login"
                  className="block w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition text-center"
                >
                  Login to Checkout
                </Link>
              ) : (
                <button
                  onClick={() => setShowOrderForm(true)}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition"
                >
                  Proceed to Checkout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}