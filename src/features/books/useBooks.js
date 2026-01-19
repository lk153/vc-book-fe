import { useQuery } from '@tanstack/react-query';
import { booksAPI } from '../../api/books';

export function useBooks({ category = 'Tất cả', page = 1, limit = 12 } = {}) {
  const query = useQuery({
    queryKey: ['books', { category, page, limit }],
    queryFn: () => booksAPI.getAll({ category, page, limit }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    books: query.data?.data || [],
    pagination: query.data?.pagination || { currentPage: 1, totalPages: 1, totalBooks: 0 },
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useBookDetail(bookId) {
  const query = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => booksAPI.getById(bookId),
    enabled: !!bookId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    book: query.data?.data || query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
