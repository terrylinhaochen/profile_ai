'use client';
import { X } from 'lucide-react';

const BookModal = ({ book, onClose }) => {
  if (!book) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        // Close modal when clicking the backdrop
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">{book.title}</h3>
              <p className="text-gray-600">by {book.author}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Description</h4>
              <p className="text-gray-600 mt-1">{book.description}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900">Why This Book</h4>
              <p className="text-gray-600 mt-1">{book.relevance}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900">Key Takeaways</h4>
              <ul className="mt-1 space-y-2">
                {book.keyTakeaways.map((takeaway, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span className="text-gray-600">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal;