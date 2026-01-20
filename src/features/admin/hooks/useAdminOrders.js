import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../../api/admin';

export function useAdminOrders(filters = {}) {
  const query = useQuery({
    queryKey: ['admin', 'orders', filters],
    queryFn: () => adminAPI.getAllOrders(filters),
    staleTime: 1000 * 60 * 2,
  });

  return {
    orders: query.data?.data || query.data?.orders || [],
    pagination: query.data?.pagination || {},
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useAdminOrderDetail(orderId) {
  const query = useQuery({
    queryKey: ['admin', 'order', orderId],
    queryFn: () => adminAPI.getOrderById(orderId),
    enabled: !!orderId,
  });

  return {
    order: query.data?.order || query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }) => adminAPI.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
  });
}
