import axios from 'axios';
import type { Book, CreateBookDto, UpdateBookDto, BookQueryParameters, PaginatedResponse } from '../types/book';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Skapa axios-instans med standardkonfiguration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Lägg till response interceptor för felhantering
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API-fel:', error.response.data);
    } else if (error.request) {
      console.error('Nätverksfel:', error.message);
    }
    return Promise.reject(error);
  }
);

export const bookApi = {
  // Hämta alla böcker
  getBooks: async (params?: BookQueryParameters): Promise<PaginatedResponse<Book>> => {
    const response = await apiClient.get<Book[]>('/books', { params });
    // Anpassa svaret från backend (lista) till frontendens förväntade format (paginerat)
    return {
      data: response.data,
      pagination: {
        page: 1,
        pageSize: response.data.length,
        totalCount: response.data.length,
        totalPages: 1
      }
    };
  },

  // Hämta en enskild bok
  getBook: async (id: number): Promise<Book> => {
    const response = await apiClient.get<Book>(`/books/${id}`);
    return response.data;
  },

  // Skapa en ny bok
  createBook: async (data: CreateBookDto): Promise<Book> => {
    const response = await apiClient.post<Book>('/books', data);
    return response.data;
  },

  // Uppdatera en bok
  updateBook: async (id: number, data: UpdateBookDto): Promise<Book> => {
    // Backend använder PUT istället för PATCH
    const response = await apiClient.put<Book>(`/books/${id}`, data);
    return response.data;
  },

  // Ta bort en bok
  deleteBook: async (id: number): Promise<void> => {
    await apiClient.delete(`/books/${id}`);
  },
};