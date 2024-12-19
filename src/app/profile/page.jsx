'use client';
import ClientOnly from '../../components/shared/ClientOnly';
import ProfilePage from '../../components/profile/ProfilePage';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

export default function Page() {
  return (
    <ClientOnly>
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <ProfilePage />
        </div>
      </ProtectedRoute>
    </ClientOnly>
  );
}