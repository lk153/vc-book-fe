import { useState } from 'react';
import { toast } from 'react-toastify';
import ShippingAddress from './checkout/ShippingAddress';
import Cart from './checkout/Cart';
import OrderSuccess from './checkout/OrderSuccess';
import { useTranslation } from '../i18n/LanguageContext';

export default function Checkout({
  cart,
  updateCartQuantity,
  getTotalPrice,
  placeOrder,
  loading,
  isGuest
}) {
  const { t } = useTranslation();
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
      setOrderError(t('checkout.fillRequired'));
      toast.error(t('checkout.fillRequired'));
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
    return <OrderSuccess orderData={orderData} setOrderSuccess={setOrderSuccess} />
  }

  // Checkout form
  if (showOrderForm && cart.length > 0) {
    return <ShippingAddress setShowOrderForm={setShowOrderForm} 
    loading={loading} orderError={orderError} shippingAddress={shippingAddress} 
    handlePlaceOrder={handlePlaceOrder} handleInputChange={handleInputChange}
    paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} getTotalPrice={getTotalPrice}/>
  }

  // Cart view
  return <Cart cart={cart} isGuest={isGuest} updateCartQuantity={updateCartQuantity} 
  setShowOrderForm={setShowOrderForm} getTotalPrice={getTotalPrice}/>
}