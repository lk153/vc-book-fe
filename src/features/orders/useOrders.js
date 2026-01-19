import { useQuery } from '@tanstack/react-query';
import { ordersAPI } from '../../api/orders';
import { useAuth } from '../../context/AuthContext';

export function useOrders() {
  const { user } = useAuth();
  const userId = user?.id || user?._id;

  const query = useQuery({
    queryKey: ['orders', userId],
    queryFn: () => ordersAPI.getUserOrders(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Handle both response.data and direct array response
  const ordersData = query.data?.data || query.data;
  const orders = Array.isArray(ordersData) ? ordersData : [];

  return {
    orders,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
