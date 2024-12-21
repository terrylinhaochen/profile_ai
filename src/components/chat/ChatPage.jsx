"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { processBookDiscussion } from '../../utils/bookDiscussion';
import { processEndChat } from '../../utils/chatProcessor';
import { extractBookFromQuestion } from '../../utils/bookProcessor';
import { Send, ChevronRight } from 'lucide-react';
import { sanitizeForFirebase } from '../../utils/helpers';
import { ref, set } from 'firebase/database';
import { database } from '../../firebase/config';

const ChatPage = () => {
  const { user, updateUserProfile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [currentBook, setCurrentBook] = useState(null);
  const [currentStep, setCurrentStep] = useState('aim');
  const [inputValue, setInputValue] = useState('');
  const [explorationTopics, setExplorationTopics] = useState(null);
  const [discussionCount, setDiscussionCount] = useState(0);
  const messagesEndRef = useRef(null);
  const [expandedAids, setExpandedAids] = useState([]);

  const learningGoals = [
    {
      title: "Explore Key Ideas",
      description: "Understand the main themes and concepts",
      icon: "🎯"
    },
    {
      title: "Apply to Life",
      description: "Connect insights to personal situations",
      icon: "💡"
    },
    {
      title: "Critical Analysis",
      description: "Analyze writing style and arguments",
      icon: "🔍"
    },
    {
      title: "Historical Context",
      description: "Understand background and influence",
      icon: "📚"
    }
  ];

  useEffect(() => {
    setMessages([{
      type: 'assistant',
      content: "Hello! Which book would you like to discuss? Just mention it in your question."
    }]);
  }, []);

  useEffect(() => {
    const generateExplorationTopics = async () => {
      if (currentBook) {
        try {
          const response = await processBookDiscussion(
            currentBook,
            "Generate a structured exploration guide with main categories and specific topics to explore",
            user?.uid,
            { 
              type: 'exploration_guide',
              format: {
                categories: ["Themes", "Characters", "Symbolism", "Plot Points"],
                topicsPerCategory: 3,
                includeQuestions: true
              }
            }
          );
          
          setExplorationTopics(response.explorationGuide);
        } catch (error) {
          console.error('Error generating exploration topics:', error);
        }
      }
    };

    generateExplorationTopics();
  }, [currentBook]);

  const handleBookSelect = (book) => {
    if (!book) return;
    
    const safeBook = {
      id: book.id || `book-${book.title.replace(/\s+/g, '-').toLowerCase()}`,
      title: book.title || 'Untitled Book',
      author: book.author || 'Unknown Author',
      description: book.description || ''
    };
    
    setCurrentBook(safeBook);
    setMessages(prev => [...prev, {
      type: 'assistant',
      content: `Great choice! Let's discuss ${safeBook.title}. What would you like to focus on?`,
      goalOptions: learningGoals
    }]);
  };

  const handleTopicClick = async (category, topic) => {
    try {
      setMessages(prev => [...prev,
        { 
          type: 'user', 
          content: `Let's explore ${topic} in ${currentBook.title}` 
        },
        { 
          type: 'assistant', 
          content: 'Analyzing this topic...', 
          loading: true 
        }
      ]);

      const response = await processBookDiscussion(
        currentBook,
        `Analyze ${topic} in ${currentBook.title}, focusing on its significance within the ${category.toLowerCase()}.`,
        user?.uid,
        { 
          type: 'topic_exploration',
          category: category,
          topic: topic
        }
      );

      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          type: 'assistant',
          content: response.content,
          learningAids: response.learningAids,
          prefills: response.prefills
        }
      ]);
      setDiscussionCount(prev => prev + 1);
    } catch (error) {
      console.error('Error exploring topic:', error);
      // Handle error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    try {
      // If no book is selected yet, try to extract it from the question
      if (!currentBook) {
        const bookInfo = await extractBookFromQuestion(inputValue);
        
        if (bookInfo?.bookFound) {
          const safeBook = {
            id: sanitizeForFirebase(bookInfo.title),
            title: bookInfo.title,
            author: bookInfo.author || 'Unknown',
            description: ''
          };
          setCurrentBook(safeBook);
          
          // Add initial message about the book
          setMessages(prev => [...prev,
            { type: 'user', content: inputValue },
            {
              type: 'assistant',
              content: `Great! Let's discuss ${safeBook.title}. What would you like to know about it?`
            }
          ]);
          setInputValue('');
          return;
        } else {
          setMessages(prev => [...prev, {
            type: 'assistant',
            content: "I couldn't identify which book you'd like to discuss. Could you please mention the book title in your question?"
          }]);
          setInputValue('');
          return;
        }
      }

      setMessages(prev => [...prev,
        { type: 'user', content: inputValue },
        { type: 'assistant', content: 'Thinking...', loading: true }
      ]);

      const response = await processBookDiscussion(
        currentBook,
        inputValue,
        user?.uid,
        { type: 'question' }
      );

      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          type: 'assistant',
          content: response.content,
          learningAids: response.learningAids,
          prefills: response.prefills
        }
      ]);

      setInputValue('');
      setDiscussionCount(prev => prev + 1);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          type: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again.',
        }
      ]);
    }
  };

  const handleEndChat = async () => {
    if (!currentBook || messages.length === 0) return;

    try {
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: 'Updating profile...',
      }]);

      const analysis = await processEndChat(
        messages,
        currentBook,
        user?.uid || 'anonymous'
      );

      if (user?.uid) {
        const chatRef = ref(database, `chatHistory/${user.uid}/${currentBook.id}`);
        await set(chatRef, {
          timestamp: new Date().toISOString(),
          book: currentBook,
          analysis: analysis
        });
      }

      // Reset chat state
      setCurrentStep('aim');
      setExplorationTopics(null);
      setDiscussionCount(0);
      setCurrentBook(null);
      setMessages([{
        type: 'assistant',
        content: "Hello! Which book would you like to discuss? Just mention it in your question."
      }]);

    } catch (error) {
      console.error('Error ending chat:', error);
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: 'I apologize, but I encountered an error while updating your profile.'
      }]);
    }
  };

  const handlePrefillClick = async (prefill) => {
    try {
      setMessages(prev => [...prev,
        { type: 'user', content: prefill },
        { type: 'assistant', content: 'Thinking...', loading: true }
      ]);

      const response = await processBookDiscussion(
        currentBook,
        prefill,
        user?.uid,
        { type: 'question' }
      );

      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          type: 'assistant',
          content: response.content,
          learningAids: response.learningAids,
          prefills: response.prefills
        }
      ]);

      setDiscussionCount(prev => prev + 1);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          type: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again.',
        }
      ]);
    }
  };

  const renderMessage = (message) => {
    return (
      <div className={`p-4 rounded-lg ${
        message.type === 'user' ? 'bg-blue-50 ml-auto max-w-[80%]' : 'bg-gray-50 max-w-[80%]'
      }`}>
        <div className="prose max-w-none">
          {message.content}
        </div>
        
        {message.learningAids && (
          <div className="mt-4 space-y-4">
            {message.learningAids.map((aid, idx) => (
              <div 
                key={idx}
                onClick={() => handleCardClick(aid)}
                className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 
                         hover:shadow-md transition-shadow cursor-pointer"
              >
                <h4 className="font-medium mb-2">{aid.title}</h4>
                <p className="text-gray-600">{aid.content}</p>
                <div className="mt-2 text-sm text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to explore this topic in depth →
                </div>
              </div>
            ))}
          </div>
        )}

        {message.prefills && (
          <div className="mt-4 space-y-2 bg-white p-3 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Related Questions:</h4>
            <div className="flex flex-wrap gap-2">
              {message.prefills.map((prefill, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePrefillClick(prefill)}
                  className="px-3 py-1 bg-white text-gray-600 rounded-full text-sm 
                           hover:bg-gray-50 border border-gray-200
                           hover:border-blue-300 hover:text-blue-600 transition-all"
                >
                  {prefill}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleCardClick = async (aid) => {
    try {
      const expandQuestion = `Tell me more about ${aid.title} in relation to ${currentBook.title}. 
                            Specifically, expand on: ${aid.content}`;

      setMessages(prev => [...prev,
        { 
          type: 'user', 
          content: `Expand on: ${aid.title}` 
        },
        {
          type: 'assistant',
          content: 'Analyzing this aspect in detail...',
          loading: true
        }
      ]);

      const response = await processBookDiscussion(
        currentBook,
        expandQuestion,
        user?.uid,
        { type: 'exploration' }
      );

      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          type: 'assistant',
          content: response.content,
          learningAids: response.learningAids,
          prefills: response.prefills
        }
      ]);

      setDiscussionCount(prev => prev + 1);
    } catch (error) {
      console.error('Error expanding topic:', error);
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          type: 'assistant',
          content: 'I apologize, but I encountered an error analyzing this topic. Please try again.',
        }
      ]);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <header className="bg-white shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <h1 className="text-xl font-semibold text-gray-900">ReadAI</h1>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-6 h-full">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h2 className="font-semibold text-gray-900 mb-4">Current Book</h2>
                {currentBook ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{currentBook.title}</h3>
                      <p className="text-sm text-gray-500">by {currentBook.author}</p>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Discussion Progress</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${Math.min((discussionCount / 5) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {discussionCount} messages
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleEndChat}
                      className="w-full px-4 py-2 text-red-600 hover:bg-red-50 
                               rounded-lg border border-red-200 transition-colors"
                    >
                      End Discussion
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Search for a book to start the discussion
                  </p>
                )}
              </div>

              {/* Areas to Explore Section */}
              {explorationTopics && (
                <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Areas to Explore</h2>
                  <div className="space-y-6">
                    {Object.entries(explorationTopics).map(([category, topics]) => (
                      <div key={category} className="space-y-2">
                        <h3 className="text-lg font-medium text-gray-800">{category}</h3>
                        <div className="space-y-1">
                          {topics.map((topic, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleTopicClick(category, topic)}
                              className="w-full text-left px-2 py-1.5 text-gray-600 hover:text-gray-900 
                                       hover:bg-gray-50 rounded-md transition-colors duration-150"
                            >
                              {topic}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main chat container */}
            <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col h-[calc(100vh-12rem)]">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, idx) => (
                  <div key={idx}>
                    {renderMessage(message)}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4">
                <div className="p-4 border-t">
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter your question or thoughts..."
                      className="flex-1 p-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                      type="submit"
                      disabled={!inputValue.trim()}
                      className={`p-2 rounded-lg ${
                        !inputValue.trim()
                          ? 'bg-gray-300 cursor-not-allowed' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage; 