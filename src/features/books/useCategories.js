import { useQuery } from '@tanstack/react-query';
import { categoriesAPI } from '../../api/categories';

export function useCategories() {
  const query = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Add "All" category at the beginning for filtering purposes
  const categories = query.data?.data || query.data?.categories || [];

  return {
    categories,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
