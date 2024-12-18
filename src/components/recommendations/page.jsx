import RecommendationsPage from '@/components/recommendations/RecommendationsPage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute>
      <RecommendationsPage />
    </ProtectedRoute>
  );
}