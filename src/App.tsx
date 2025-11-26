import { useState } from 'react';
import { BookList } from './components/BookList';
import { BookForm } from './components/BookForm';
import { useBooks } from './hooks/useBooks';
import type { Book, CreateBookDto } from './types/book';
import { BookFilters } from './components/BookFiltersComponent';
import { ErrorMessage } from './components/ErrorMessage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Pagination } from './components/Pagination';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Toast } from './components/Toast';

function App() {
  const {
    books,
    isLoading,
    error,
    pagination,
    createBook,
    updateBook,
    deleteBook,
    clearError,
    fetchBooks,
    handlePageChange,
    handlePageSizeChange,
    handleSearch
  } = useBooks();
  
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  // State for ConfirmDialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // State for Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleSubmit = async (data: CreateBookDto) => {
    let success = false;

    if (editingBook) {
      success = await updateBook(editingBook.id, data);
      if (success) showToast('Boken uppdaterades!', 'success');
    } else {
      success = await createBook(data);
      if (success) showToast('Boken skapades!', 'success');
    }

    if (success) {
      setShowForm(false);
      setEditingBook(null);
    } else {
      showToast('Något gick fel.', 'error');
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Ta bort bok',
      message: 'Är du säker på att du vill ta bort denna bok? Detta går inte att ångra.',
      onConfirm: async () => {
        const success = await deleteBook(id);
        if (success) {
          showToast('Boken togs bort.', 'success');
        } else {
          showToast('Kunde inte ta bort boken.', 'error');
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBook(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Bokbibliotek
          </h1>
          <p className="text-gray-600">
            Hantera din boksamling
          </p>
        </header>

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {error && <ErrorMessage message={error} onDismiss={clearError} />}

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        />

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            + Lägg till ny bok
          </button>
        )}

        {showForm && (
          <BookForm
            book={editingBook}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        )}

        <div className="mb-6">
          <BookFilters 
            onFilter={fetchBooks} 
            onSearch={handleSearch}
            isLoading={isLoading} 
          />
        </div>

        {isLoading && !books.length ? (
          <LoadingSpinner />
        ) : (
          <>
            <BookList
              books={books}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
            
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              pageSize={pagination.pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;