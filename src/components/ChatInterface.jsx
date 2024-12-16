// src/components/ChatInterface.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot } from 'lucide-react';

const ChatInterface = ({ userProfile, onProfileUpdate }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

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
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.content,
        prefills: data.prefills 
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

  const MessageBubble = ({ message, isLast }) => (
    <div
      className={`flex items-start gap-3 ${
        message.role === 'user' ? 'flex-row-reverse' : ''
      }`}
    >
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center
        ${message.role === 'user' ? 'bg-blue-100' : 'bg-purple-100'}`}>
        {message.role === 'user' ? (
          <User className="w-5 h-5 text-blue-600" />
        ) : (
          <Bot className="w-5 h-5 text-purple-600" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col max-w-[80%] ${
        message.role === 'user' ? 'items-end' : 'items-start'
      }`}>
        <div className={`rounded-2xl px-4 py-2.5 ${
          message.role === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}>
          <p className="text-[15px] leading-normal">{message.content}</p>
        </div>

        {/* Suggestion Chips */}
        {message.prefills && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.prefills.map((prefill, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputValue(prefill);
                  handleSubmit();
                }}
                className="px-4 py-1.5 text-sm bg-white text-gray-600 
                         rounded-full hover:bg-gray-50 border border-gray-200
                         transition-colors duration-200 hover:text-blue-600
                         hover:border-blue-200"
              >
                {prefill}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[700px] w-full bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Chat Assistant</h2>
        <p className="text-sm text-gray-500 mt-1">Ask me anything about your interests and books</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {messages.map((message, idx) => (
          <MessageBubble 
            key={idx} 
            message={message} 
            isLast={idx === messages.length - 1}
          />
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Bot className="w-5 h-5 text-purple-600" />
            </div>
            <div className="px-4 py-2.5 bg-gray-100 rounded-2xl">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                     outline-none transition-all duration-200"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600
                     disabled:bg-gray-200 disabled:cursor-not-allowed
                     transition-colors duration-200 flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;