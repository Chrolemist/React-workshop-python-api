import { useState } from 'react';
import type { BookQueryParameters } from '../types/book';

interface BookFiltersProps {
  onFilter: (params: BookQueryParameters) => void;
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export function BookFilters({ onFilter, onSearch, isLoading }: BookFiltersProps) {
  const [filters, setFilters] = useState<BookQueryParameters>({
    author: '',
    year: undefined,
    isAvailable: undefined,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanFilters: BookQueryParameters = {};
    if (filters.author) cleanFilters.author = filters.author;
    if (filters.year) cleanFilters.year = filters.year;
    if (filters.isAvailable !== undefined) cleanFilters.isAvailable = filters.isAvailable;

    onFilter(cleanFilters);
  };

  const handleReset = () => {
    setFilters({
      author: '',
      year: undefined,
      isAvailable: undefined,
    });
    onFilter({});
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Sök på titel eller författare..."
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
        />
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Författare
            </label>
            <input
              type="text"
              value={filters.author}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, author: e.target.value }))
              }
              placeholder="Sök efter författare..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              År
            </label>
            <input
              type="number"
              value={filters.year || ''}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  year: e.target.value ? parseInt(e.target.value) : undefined,
                }))
              }
              placeholder="Filtrera efter år..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tillgänglighet
            </label>
            <select
              value={
                filters.isAvailable === undefined
                  ? ''
                  : filters.isAvailable.toString()
              }
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  isAvailable:
                    e.target.value === ''
                      ? undefined
                      : e.target.value === 'true',
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={isLoading}
            >
              <option value="">Alla</option>
              <option value="true">Tillgänglig</option>
              <option value="false">Utlånad</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Tillämpa filter
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
          >
            Återställ
          </button>
        </div>
      </form>
    </div>
  );
}