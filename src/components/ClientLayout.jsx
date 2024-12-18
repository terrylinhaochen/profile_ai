'use client';
import { usePathname } from 'next/navigation';
import { MessageSquare, User, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { ProfileProvider } from '../app/context/ProfileContext';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  
  const navItems = [
    {
      href: '/chat',
      icon: <MessageSquare className="w-4 h-4" />,
      label: 'Chat'
    },
    {
      href: '/recommendations',
      icon: <BookOpen className="w-4 h-4" />,
      label: 'Recommendations'
    },
    {
      href: '/profile',
      icon: <User className="w-4 h-4" />,
      label: 'Profile'
    }
  ];

  return (
    <ProfileProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="text-xl font-semibold text-gray-900">
                Profile AI
              </Link>
              
              <nav className="flex items-center gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm
                      ${pathname === item.href
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </ProfileProvider>
  );
}