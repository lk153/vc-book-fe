import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../../api/admin';

export function useAdminBooks(filters = {}) {
  const query = useQuery({
    queryKey: ['admin', 'books', filters],
    queryFn: () => adminAPI.getAllBooks(filters),
    staleTime: 1000 * 60 * 2,
  });

  return {
    books: query.data?.data || query.data?.books || [],
    pagination: query.data?.pagination || {},
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookData) => adminAPI.createBook(bookData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'books'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookId, bookData }) => adminAPI.updateBook(bookId, bookData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'books'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId) => adminAPI.deleteBook(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'books'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}
