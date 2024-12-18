import { Inter } from 'next/font/google';
import ClientLayout from '../components/shared/ClientLayout';
import './globals.css'
import { AuthProvider } from '../context/AuthContext';
import { ProfileProvider } from '../context/ProfileContext';
import Navigation from '../components/shared/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Profile AI',
  description: 'AI-powered reading recommendations',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ProfileProvider>
            <Navigation />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}