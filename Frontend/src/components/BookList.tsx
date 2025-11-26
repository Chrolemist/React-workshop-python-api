import type { Book } from '../types/book';

interface BookListProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

export function BookList({ books, onEdit, onDelete, isLoading }: BookListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-600">Laddar böcker...</div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center p-8 text-gray-600">
        Inga böcker hittades. Lägg till din första bok!
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <div
          key={book.id}
          className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {book.title}
            </h3>
            <span
              className={`px-2 py-1 text-xs rounded ${
                book.isAvailable
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {book.isAvailable ? 'Tillgänglig' : 'Utlånad'}
            </span>
          </div>
          
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Författare:</span> {book.author}
          </p>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">ISBN:</span> {book.isbn}
          </p>
          <p className="text-gray-600 mb-4">
            <span className="font-medium">År:</span> {book.year}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(book)}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Redigera
            </button>
            <button
              onClick={() => onDelete(book.id)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Ta bort
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}