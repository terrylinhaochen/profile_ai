'use client';
import { usePathname } from 'next/navigation';
import { MessageSquare, User } from 'lucide-react';
import Link from 'next/link';
import { ProfileProvider } from '../app/context/ProfileContext';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  
  return (
    <ProfileProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="text-xl font-semibold text-gray-900">
                Profile AI
              </Link>
              
              <nav className="flex items-center gap-4">
                <Link
                  href="/chat"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm
                    ${pathname === '/chat'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </Link>
                <Link
                  href="/profile"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm
                    ${pathname === '/profile'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </ProfileProvider>
  );
}