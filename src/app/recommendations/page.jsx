'use client';
import RecommendationsPage from '../../components/recommendations/RecommendationsPage';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <RecommendationsPage />
      </div>
    </ProtectedRoute>
  );
}