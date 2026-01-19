import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../../api/admin';

export function useAdminUsers(filters = {}) {
  const query = useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: () => adminAPI.getAllUsers(filters),
    staleTime: 1000 * 60 * 2,
  });

  return {
    users: query.data?.data || query.data?.users || [],
    pagination: query.data?.pagination || {},
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useAdminUserDetail(userId) {
  const query = useQuery({
    queryKey: ['admin', 'user', userId],
    queryFn: () => adminAPI.getUserById(userId),
    enabled: !!userId,
  });

  return {
    user: query.data?.data || query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useResetUserPassword() {
  return useMutation({
    mutationFn: (userId) => adminAPI.resetUserPassword(userId),
  });
}

export function useToggleUserBan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, banned }) => adminAPI.toggleUserBan(userId, banned),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}
