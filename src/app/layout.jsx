'use client';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';
import { ProfileProvider } from '../context/ProfileContext';
import Navigation from '../components/shared/Navigation';
import { useState, useEffect } from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <html lang="en" className={inter.className}>
      <body>
        <AuthProvider>
          <ProfileProvider>
            <Navigation />
            <main className="min-h-screen bg-gray-50">
              {children}
            </main>
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}