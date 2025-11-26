import { useState, useEffect, useCallback } from 'react';
import type { Book, CreateBookDto, UpdateBookDto, BookQueryParameters } from '../types/book';
import { bookApi } from '../services/api';

export function useBooks(initialParams?: BookQueryParameters) {
  const [allBooks, setAllBooks] = useState<Book[]>([]); // Store all fetched books
  const [books, setBooks] = useState<Book[]>([]); // Store displayed (filtered/paginated) books
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Client-side state
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  });

  const fetchBooks = useCallback(async (params?: BookQueryParameters) => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch ALL books from backend (since backend doesn't support advanced filtering/pagination yet)
      const response = await bookApi.getBooks(params || initialParams);
      setAllBooks(response.data);
      // Initial pagination will be handled by useEffect
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Misslyckades att hämta böcker';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [initialParams]);

  // Handle client-side filtering and pagination
  useEffect(() => {
    let result = [...allBooks];

    // 1. Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(book => 
        book.title.toLowerCase().includes(query) || 
        book.author.toLowerCase().includes(query)
      );
    }

    // 2. Calculate pagination
    const totalCount = result.length;
    const totalPages = Math.ceil(totalCount / pagination.pageSize);
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    
    const paginatedBooks = result.slice(startIndex, endIndex);

    setBooks(paginatedBooks);
    setPagination(prev => ({
      ...prev,
      totalCount,
      totalPages: totalPages || 1 // Ensure at least 1 page
    }));

  }, [allBooks, searchQuery, pagination.page, pagination.pageSize]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize, page: 1 })); // Reset to page 1
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on search
  };

  const createBook = async (data: CreateBookDto): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const newBook = await bookApi.createBook(data);
      setAllBooks((prev) => [...prev, newBook]);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Misslyckades att skapa bok';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBook = async (id: number, data: UpdateBookDto): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedBook = await bookApi.updateBook(id, data);
      setAllBooks((prev) =>
        prev.map((book) => (book.id === id ? updatedBook : book))
      );
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Misslyckades att uppdatera bok';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBook = async (id: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await bookApi.deleteBook(id);
      setAllBooks((prev) => prev.filter((book) => book.id !== id));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Misslyckades att ta bort bok';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Hämta böcker vid montering
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return {
    books,
    isLoading,
    error,
    pagination,
    fetchBooks,
    createBook,
    updateBook,
    deleteBook,
    clearError: () => setError(null),
    handlePageChange,
    handlePageSizeChange,
    handleSearch
  };
}