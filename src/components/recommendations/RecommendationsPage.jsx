'use client';
import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import TopOfMindSection from './TopOfMindSection';
import CareerGrowthSection from './CareerGrowthSection';
import PersonalInterestsSection from './PersonalInterestsSection';
import LoadingSpinner from '../shared/LoadingSpinner';

const RecommendationsPage = ({ userProfile }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      console.log('Fetching recommendations for profile:', userProfile);

      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile }),
      });
      
      const data = await response.json();
      console.log('API Response:', data);

      if (data.error) {
        console.error('API Error:', data.error, 'Details:', data.details);
        setError(`Error: ${data.error}${data.details ? ` - ${data.details}` : ''}`);
        return;
      }

      setRecommendations(data);
      setError(null);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile) {
      fetchRecommendations();
    }
  }, [userProfile]);

  console.log('Rendering with:', { loading, recommendations, userProfile });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Your Reading Recommendations</h1>
          <p className="text-gray-600">Curated books based on your profile and interests</p>
        </div>
        <button
          onClick={fetchRecommendations}
          className="px-4 py-2 text-blue-500 hover:text-blue-600 
                   flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : recommendations ? (
        <div className="space-y-12">
          <TopOfMindSection books={recommendations.topOfMind} />
          <CareerGrowthSection books={recommendations.careerGrowth} />
          <PersonalInterestsSection books={recommendations.personalInterests} />
        </div>
      ) : !error && (
        <div className="text-center py-12 text-gray-600">
          No recommendations available. Try refreshing.
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;