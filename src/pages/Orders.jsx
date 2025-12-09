import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navigation from '../components/Navigation';
import { ordersAPI } from '../services/api';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Loader2,
  Calendar,
  DollarSign,
  MapPin,
  Phone,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

export default function Orders({ cart, user, onLogout }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast.warning('Please login to view orders');
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch orders on mount
  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const userId = user.id || user._id;
        const response = await ordersAPI.getUserOrders(userId);

        if (isMounted) {
          // Handle both response.data and direct array response
          const ordersData = response.data || response;
          setOrders(Array.isArray(ordersData) ? ordersData : []);
        }
      } catch (err) {
        if (isMounted) {
          const errorMsg = err.message || 'Failed to load orders';
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || '';

    const styles = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
      processing: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Package },
      shipped: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Truck },
      delivered: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
      completed: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
    };

    const style = styles[statusLower] || styles.pending;
    const Icon = style.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${style.bg} ${style.text}`}>
        <Icon size={16} />
        {status || 'Pending'}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Toggle order details
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (!user) {
    return null; // Will redirect via useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation cart={cart} user={user} onLogout={onLogout} showBackButton={true} />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
            <p className="text-xl text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation cart={cart} user={user} onLogout={onLogout} showBackButton={true} />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <XCircle className="mx-auto text-red-500 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-red-700 mb-2">Error Loading Orders</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
            >
              {t('common.retry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation cart={cart} user={user} onLogout={onLogout} showBackButton={true} />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Orders</h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
            <Package className="text-blue-600" size={20} />
            <span className="text-sm font-semibold text-gray-700">
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </span>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Browse Books
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id || order.id || order.orderNumber}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition hover:shadow-xl"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">
                          Order #{order.orderNumber || order._id?.slice(-8) || 'N/A'}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>{formatDate(order.createdAt || order.orderDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign size={16} />
                          <span className="font-semibold">${order.summary?.total?.toFixed(2) || order.totalAmount?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package size={16} />
                          <span>{order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleOrderDetails(order._id || order.id)}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                    >
                      <span className="text-sm font-medium">
                        {expandedOrder === (order._id || order.id) ? 'Hide Details' : 'View Details'}
                      </span>
                      {expandedOrder === (order._id || order.id) ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Order Details (Expandable) */}
                {expandedOrder === (order._id || order.id) && (
                  <div className="p-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Shipping Address */}
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <MapPin size={20} className="text-blue-600" />
                          Shipping Address
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="font-semibold">{order.shippingAddress?.fullName || 'N/A'}</p>
                          <p>{order.shippingAddress?.address}</p>
                          <p>
                            {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
                          </p>
                          <p>{order.shippingAddress?.country || 'USA'}</p>
                          {order.shippingAddress?.phone && (
                            <p className="flex items-center gap-1 mt-2">
                              <Phone size={14} />
                              {order.shippingAddress.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <DollarSign size={20} className="text-blue-600" />
                          Payment Details
                        </h4>
                        <div className="text-sm text-gray-600 space-y-2">
                          <div className="flex justify-between">
                            <span>Payment Method:</span>
                            <span className="font-semibold">{order.paymentMethod || 'N/A'}</span>
                          </div>
                          {order.summary && (
                            <>
                              <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>${order.summary.subtotal?.toFixed(2) || '0.00'}</span>
                              </div>
                              {order.summary.tax > 0 && (
                                <div className="flex justify-between">
                                  <span>Tax:</span>
                                  <span>${order.summary.tax.toFixed(2)}</span>
                                </div>
                              )}
                              {order.summary.shipping > 0 && (
                                <div className="flex justify-between">
                                  <span>Shipping:</span>
                                  <span>${order.summary.shipping.toFixed(2)}</span>
                                </div>
                              )}
                              <div className="flex justify-between pt-2 border-t border-gray-200">
                                <span className="font-bold">Total:</span>
                                <span className="font-bold text-blue-600">
                                  ${order.summary.total.toFixed(2)}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Package size={20} className="text-blue-600" />
                        Order Items
                      </h4>
                      <div className="space-y-3">
                        {order.items?.map((item, index) => (
                          <div
                            key={item._id || index}
                            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                          >
                            <img
                              src={item.book?.coverImage || item.book?.image || item.image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=150&fit=crop'}
                              alt={item.book?.title || item.title || 'Book'}
                              className="w-16 h-20 object-contain rounded"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=150&fit=crop';
                              }}
                            />
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-800">
                                {item.book?.title || item.title || 'Unknown Book'}
                              </h5>
                              <p className="text-sm text-gray-600">
                                {item.book?.author || item.author || 'Unknown Author'}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                Quantity: {item.quantity} × ${item.price?.toFixed(2) || '0.00'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-800">
                                ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      {order.status?.toLowerCase() === 'pending' && (
                        <button
                          onClick={() => toast.info('Order cancellation feature coming soon!')}
                          className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition font-medium"
                        >
                          Cancel Order
                        </button>
                      )}
                      <button
                        onClick={() => toast.info('Order tracking feature coming soon!')}
                        className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
                      >
                        Track Order
                      </button>
                      <button
                        onClick={() => toast.info('Download invoice feature coming soon!')}
                        className="px-4 py-2 border-2 border-gray-600 text-gray-600 rounded-lg hover:bg-gray-50 transition font-medium"
                      >
                        Download Invoice
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}