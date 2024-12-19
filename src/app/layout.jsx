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