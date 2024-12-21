"use client";

import React, { useState } from 'react';

const BookSearch = ({ onBookSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (query) => {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=3`
    );
    const data = await response.json();
    
    const books = data.items?.slice(0, 3).map(item => ({
      id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.[0] || 'Unknown',
      description: item.volumeInfo.description,
      thumbnail: item.volumeInfo.imageLinks?.thumbnail
    })) || [];

    setSearchResults(books);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          if (e.target.value.length > 2) {
            handleSearch(e.target.value);
          }
        }}
        placeholder="Search for a book..."
        className="w-full p-2 border rounded-lg"
      />

      {searchResults.length > 0 && (
        <div className="mt-4 space-y-2">
          {searchResults.map(book => (
            <button
              key={book.id}
              onClick={() => onBookSelect(book)}
              className="w-full text-left p-4 border rounded-lg hover:bg-gray-50"
            >
              <h3 className="font-medium">{book.title}</h3>
              <p className="text-sm text-gray-600">by {book.author}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookSearch; 