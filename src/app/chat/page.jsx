'use client';
import ChatInterface from '../../components/chat/ChatInterface';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <ChatInterface />
      </div>
    </ProtectedRoute>
  );
}