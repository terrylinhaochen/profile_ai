'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, BookOpen, X } from 'lucide-react';

const ChatInterface = ({ userProfile, onProfileUpdate, router }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionInsights, setSessionInsights] = useState([]);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const messagesEndRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const suggestedQuestions = [
    "I've been reading a lot about personal development. What should I try next?",
    "Can you help me find books that match my career interests?",
    "I want to improve my leadership skills. Where should I start?",
    "What books would help me with my current challenges?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setMessages(prev => [...prev, { role: 'user', content: inputValue }]);
      setInputValue('');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          userProfile,
          chatHistory: messages
        })
      });

      if (!response.ok) throw new Error('Failed to get response');
      
      const data = await response.json();
      
      // Track insights from this message
      if (data.insights) {
        setSessionInsights(prev => [...prev, ...data.insights]);
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.content,
        prefills: data.suggestedQuestions 
      }]);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = () => {
    setShowEndDialog(true);
  };

  const confirmEndSession = () => {
    if (sessionInsights.length > 0) {
      onProfileUpdate(prev => ({
        ...prev,
        sessionHistory: [
          ...(prev?.sessionHistory || []),
          {
            date: new Date().toISOString(),
            insights: sessionInsights,
          }
        ]
      }));
    }
    router.push('/profile');
  };

  if (!mounted) {
    return null; // Return nothing during SSR
  }

  return (
    <div className="relative flex flex-col h-[600px] w-full bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Chat Assistant</h2>
          <p className="text-sm text-gray-500">Ask me anything about books and reading</p>
        </div>
        <button
          onClick={handleEndSession}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-red-500 
                   border border-gray-200 rounded-md hover:border-red-200 
                   transition-colors duration-200 flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          End Session
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2 ${
              message.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center
              ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              {message.role === 'user' ? (
                <User className="w-4 h-4 text-blue-600" />
              ) : (
                <Bot className="w-4 h-4 text-gray-600" />
              )}
            </div>

            <div className={`flex flex-col max-w-[75%] ${
              message.role === 'user' ? 'items-end' : 'items-start'
            }`}>
              <div className={`rounded-lg px-3 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm">{message.content}</p>
              </div>

              {message.prefills && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.prefills.map((prefill, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInputValue(prefill);
                        handleSubmit();
                      }}
                      className="px-3 py-1 text-xs bg-white text-gray-600 
                               rounded-full hover:bg-gray-50 border border-gray-200"
                    >
                      {prefill}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-gray-600" />
            </div>
            <div className="px-3 py-2 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: "0.2s"}}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: "0.4s"}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none 
                     focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-3 py-2 bg-blue-500 text-white rounded-md 
                     hover:bg-blue-600 disabled:bg-gray-300 
                     disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* End Session Dialog */}
      {showEndDialog && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-2">End Chat Session?</h3>
            <p className="text-gray-600 mb-4">
              Your profile will be updated with insights from this conversation.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEndDialog(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmEndSession}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Confirm & View Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;