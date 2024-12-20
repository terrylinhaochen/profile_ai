'use client';
import Providers from '../components/Providers';
import Navigation from '../components/shared/Navigation';
import '../app/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head />
      <body className="min-h-full bg-gray-50 antialiased">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}