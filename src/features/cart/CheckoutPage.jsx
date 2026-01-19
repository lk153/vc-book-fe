import { useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from '../../i18n/LanguageContext';
import { ordersAPI } from '../../api/orders';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { CartPage } from './CartPage';
import { ShippingAddressPage } from './ShippingAddressPage';
import { OrderSuccessPage } from './OrderSuccessPage';

export function CheckoutPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();

  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState(null);

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

  const userId = user?.id || user?._id;

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
      setLoading(true);

      const orderPayload = {
        userId: userId,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod || 'Credit Card',
      };

      const response = await ordersAPI.place(orderPayload);

      // Clear cart after successful order
      await clearCart();

      setOrderData(response.data);
      setOrderSuccess(true);
      toast.success('Order placed successfully!');
    } catch (err) {
      const errorMsg = err.message || 'Failed to place order';
      setOrderError(errorMsg);
      toast.error(`Failed to place order: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // Order success screen
  if (orderSuccess && orderData) {
    return (
      <OrderSuccessPage
        orderData={orderData}
        onContinueShopping={() => setOrderSuccess(false)}
      />
    );
  }

  // Checkout form
  if (showOrderForm && cart.length > 0) {
    return (
      <ShippingAddressPage
        onBack={() => setShowOrderForm(false)}
        loading={loading}
        orderError={orderError}
        shippingAddress={shippingAddress}
        handlePlaceOrder={handlePlaceOrder}
        handleInputChange={handleInputChange}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />
    );
  }

  // Cart view
  return (
    <CartPage
      onProceedToCheckout={() => setShowOrderForm(true)}
    />
  );
}
