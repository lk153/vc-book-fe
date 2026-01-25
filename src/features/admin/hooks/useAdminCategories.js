import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../../api/admin';

export function useAdminCategories(filters = {}) {
  const query = useQuery({
    queryKey: ['admin', 'categories', filters],
    queryFn: () => adminAPI.getAllCategories(filters),
    staleTime: 1000 * 60 * 2,
  });

  return {
    categories: query.data?.data || query.data?.categories || [],
    pagination: query.data?.pagination || {},
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useAdminCategoryDetail(categoryId) {
  const query = useQuery({
    queryKey: ['admin', 'categories', categoryId],
    queryFn: () => adminAPI.getCategoryById(categoryId),
    enabled: !!categoryId,
  });

  return {
    category: query.data?.data || query.data?.category || null,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData) => adminAPI.createCategory(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, categoryData }) => adminAPI.updateCategory(categoryId, categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId) => adminAPI.deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
