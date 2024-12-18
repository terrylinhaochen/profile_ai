'use client';
import React, { useState } from 'react';
import { Briefcase, Book } from 'lucide-react';
import BookModal from './BookModal';

const CareerGrowthSection = ({ books }) => {
  const [selectedBook, setSelectedBook] = useState(null);

  if (!books) return null;

  return (
    <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-500">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Career Growth</h2>
            <p className="text-sm text-gray-500">
              Books to enhance your professional development
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {books.map((book, index) => (
            <button
              key={index}
              onClick={() => setSelectedBook(book)}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md 
                       transition-shadow text-left flex flex-col h-full"
            >
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <Book className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <h3 className="font-medium text-gray-900 line-clamp-2">{book.title}</h3>
                </div>
                <p className="text-sm text-gray-500 mb-2">by {book.author}</p>
                <p className="text-sm text-gray-600 line-clamp-3">{book.description}</p>
              </div>
              <div className="mt-3 text-sm text-blue-600 hover:text-blue-700">
                Click to learn more
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </section>
  );
};

export default CareerGrowthSection;