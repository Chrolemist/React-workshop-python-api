export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  year: number;
  isAvailable: boolean;
}

export interface CreateBookDto {
  title: string;
  author: string;
  isbn: string;
  year: number;
}

export interface UpdateBookDto {
  title?: string;
  author?: string;
  isbn?: string;
  year?: number;
  isAvailable?: boolean;
}

export interface BookQueryParameters {
  author?: string;
  year?: number;
  isAvailable?: boolean;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}