'use client';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { MessageSquare, User, BookOpen } from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Profile AI
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  href="/chat" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Chat</span>
                </Link>
                <Link 
                  href="/recommendations" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Recommendations</span>
                </Link>
                <Link 
                  href="/profile" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => logout()}
                  className="px-4 py-2 text-red-600 hover:text-red-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/signin"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
