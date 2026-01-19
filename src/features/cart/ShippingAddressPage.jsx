import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Loader2, ShoppingCart, MapPin, Edit3 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTranslation } from '../../i18n/LanguageContext';
import { formatPrice } from '../../utils/price';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ordersAPI } from '../../api/orders';
import { useOrders } from '../orders/useOrders';

const EMPTY_ADDRESS = {
  fullName: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'VN',
  phone: ''
};

export function ShippingAddressPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { orders, isLoading: ordersLoading } = useOrders();

  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [addressMode, setAddressMode] = useState('custom'); // 'custom' or 'saved'
  const [shippingAddress, setShippingAddress] = useState(EMPTY_ADDRESS);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  const userId = user?.id || user?._id;

  // Get saved address from most recent order
  const savedAddress = orders.length > 0 ? orders[0]?.shippingAddress : null;
  const hasSavedAddress = savedAddress && savedAddress.fullName && savedAddress.address;

  // Auto-select saved address if available and set initial address
  useEffect(() => {
    if (hasSavedAddress && !ordersLoading) {
      setAddressMode('saved');
      setShippingAddress({
        fullName: savedAddress.fullName || '',
        address: savedAddress.address || '',
        city: savedAddress.city || '',
        state: savedAddress.state || '',
        postalCode: savedAddress.postalCode || '',
        country: savedAddress.country || 'VN',
        phone: savedAddress.phone || ''
      });
    }
  }, [hasSavedAddress, ordersLoading, savedAddress]);

  const handleAddressModeChange = (mode) => {
    setAddressMode(mode);
    if (mode === 'saved' && savedAddress) {
      setShippingAddress({
        fullName: savedAddress.fullName || '',
        address: savedAddress.address || '',
        city: savedAddress.city || '',
        state: savedAddress.state || '',
        postalCode: savedAddress.postalCode || '',
        country: savedAddress.country || 'VN',
        phone: savedAddress.phone || ''
      });
    } else if (mode === 'custom') {
      setShippingAddress(EMPTY_ADDRESS);
    }
  };

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

      toast.success('Order placed successfully!');

      // Navigate to order success page with order data
      navigate('/order-success', { state: { orderData: response.data } });
    } catch (err) {
      const errorMsg = err.message || 'Failed to place order';
      setOrderError(errorMsg);
      toast.error(`Failed to place order: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // Redirect to cart if empty
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button
              onClick={() => navigate('/cart')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Home size={20} />
              <span>{t('checkout.backToCart')}</span>
            </button>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">{t('cart.empty')}</h2>
            <p className="text-gray-500 mb-6">{t('cart.emptyMessage')}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              {t('cart.browseBooks')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Home size={20} />
            <span>{t('checkout.backToCart')}</span>
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">{t('checkout.title')}</h1>

        {orderError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{orderError}</p>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="bg-white rounded-xl shadow-lg p-8">
          {/* Address Mode Selection - Only show if saved address exists */}
          {hasSavedAddress && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('checkout.addressOption')}
              </label>
              <div className="space-y-3">
                {/* Saved Address Option */}
                <label
                  className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${
                    addressMode === 'saved'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="addressMode"
                    value="saved"
                    checked={addressMode === 'saved'}
                    onChange={() => handleAddressModeChange('saved')}
                    className="mt-1 w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={18} className="text-blue-600" />
                      <span className="font-medium text-gray-800">{t('checkout.useSavedAddress')}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{savedAddress.fullName}</p>
                      <p>{savedAddress.address}</p>
                      <p>{savedAddress.city}, {savedAddress.state} {savedAddress.postalCode}</p>
                      <p>{savedAddress.country}</p>
                      {savedAddress.phone && <p>{savedAddress.phone}</p>}
                    </div>
                  </div>
                </label>

                {/* Custom Address Option */}
                <label
                  className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${
                    addressMode === 'custom'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="addressMode"
                    value="custom"
                    checked={addressMode === 'custom'}
                    onChange={() => handleAddressModeChange('custom')}
                    className="mt-1 w-4 h-4 text-blue-600"
                  />
                  <div className="flex items-center gap-2">
                    <Edit3 size={18} className="text-blue-600" />
                    <span className="font-medium text-gray-800">{t('checkout.inputCustomAddress')}</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Address Form Fields */}
          <div className={hasSavedAddress && addressMode === 'saved' ? 'opacity-50 pointer-events-none' : ''}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('checkout.fullName')} *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={hasSavedAddress && addressMode === 'saved'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('checkout.phone')} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={hasSavedAddress && addressMode === 'saved'}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('checkout.address')} *
              </label>
              <input
                type="text"
                name="address"
                value={shippingAddress.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={hasSavedAddress && addressMode === 'saved'}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('checkout.city')} *
                </label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={hasSavedAddress && addressMode === 'saved'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('checkout.state')}
                </label>
                <input
                  type="text"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={hasSavedAddress && addressMode === 'saved'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('checkout.postalCode')} *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={hasSavedAddress && addressMode === 'saved'}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('checkout.country')}
              </label>
              <input
                type="text"
                name="country"
                value={shippingAddress.country}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={hasSavedAddress && addressMode === 'saved'}
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('checkout.paymentMethod')}
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Credit Card">{t('checkout.creditCard')}</option>
              <option value="Debit Card">{t('checkout.debitCard')}</option>
              <option value="PayPal">{t('checkout.paypal')}</option>
              <option value="Cash on Delivery">{t('checkout.cashOnDelivery')}</option>
            </select>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">{t('checkout.orderTotal')}</span>
              <span className="text-2xl font-bold text-blue-600">{formatPrice(getTotalPrice())}{t('common.currencySymbol')}</span>
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
              t('checkout.placeOrder')
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
