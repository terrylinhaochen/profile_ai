'use client';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link 
              href="/" 
              className="flex items-center px-2 text-gray-900 hover:text-gray-600"
            >
              Home
            </Link>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Profile
                </Link>
                <Link
                  href="/chat"
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Chat
                </Link>
                <Link
                  href="/recommendations"
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Recommendations
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-red-600 hover:text-red-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/"
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
