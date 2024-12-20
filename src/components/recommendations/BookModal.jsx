'use client';
import React, { useState } from 'react';
import { X, Book, Brain, Target, Clock } from 'lucide-react';
import BookDiscussionPage from '../books/BookDiscussionPage';

const BookModal = ({ book, onClose }) => {
  const [startLearning, setStartLearning] = useState(false);

  if (!book) return null;

  if (startLearning) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl w-full max-w-6xl h-[90vh] flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">{book.title} - Learning Session</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <BookDiscussionPage book={book} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
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

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Description</h4>
              <p className="text-gray-600 mt-1">{book.description}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900">Why This Book</h4>
              <p className="text-gray-600 mt-1">{book.relevance}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900">Key Themes</h4>
              <ul className="mt-1 space-y-2">
                {book.keyTakeaways?.map((takeaway, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span className="text-gray-600">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Estimated Time</span>
                </div>
                <p className="text-gray-600 text-sm">{book.readingTime || "15-20 minutes"}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Difficulty</span>
                </div>
                <p className="text-gray-600 text-sm">{book.difficulty || "Intermediate"}</p>
              </div>
            </div>

            <button
              onClick={() => setStartLearning(true)}
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600
                       flex items-center justify-center gap-2"
            >
              <Brain className="w-5 h-5" />
              Start Learning Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal;