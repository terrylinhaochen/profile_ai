"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ref, push, query, orderByChild, limitToLast, onValue } from 'firebase/database';
import { database } from '../firebase/config.js';

export default function ChatInterface({ userProfile }) {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Send a new message
  const sendMessage = async (message) => {
    const chatRef = ref(database, 'chats');
    const newMessage = {
      userId: userProfile.id,
      message,
      timestamp: Date.now(),
      userProfile: {
        name: userProfile.name,
        role: userProfile.role,
      }
    };
    
    try {
      await push(chatRef, newMessage);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };

  // Subscribe to real-time updates
  useEffect(() => {
    if (!mounted) return;

    const chatRef = ref(database, 'chats');
    const messagesQuery = query(
      chatRef,
      orderByChild('timestamp'),
      limitToLast(50)
    );

    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      const messagesList = [];
      snapshot.forEach((childSnapshot) => {
        messagesList.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      setMessages(messagesList.sort((a, b) => a.timestamp - b.timestamp));
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [mounted]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const success = await sendMessage(newMessage);
    if (success) {
      setNewMessage('');
    }
  };

  const confirmEndSession = async () => {
    if (window.confirm('Are you sure you want to end this session?')) {
      // Add any cleanup or session ending logic here
      router.push('/profile');
    }
  };

  if (!mounted) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Chat Session</h2>
        <button
          onClick={confirmEndSession}
          className="px-4 py-2 text-red-600 hover:text-red-700"
        >
          End Session
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg ${
              msg.userId === userProfile.id
                ? 'bg-blue-500 text-white ml-auto'
                : 'bg-gray-200 mr-auto'
            }`}
          >
            {msg.message}
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}