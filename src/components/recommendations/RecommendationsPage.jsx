'use client';
import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useProfile } from '../../app/context/ProfileContext';
import { auth } from '../../lib/firebase';
import { getRecommendations, saveRecommendations } from '../../services/recommendations';
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
      setError(null);

      if (auth.currentUser) {
        // Try to get existing recommendations first
        const existingRecommendations = await getRecommendations(auth.currentUser.uid);
        
        if (existingRecommendations) {
          setRecommendations(existingRecommendations);
          return;
        }
      }

      // If no existing recommendations or not logged in, fetch new ones
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Save recommendations if user is logged in
      if (auth.currentUser) {
        await saveRecommendations(auth.currentUser.uid, data);
      }

      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError(error.message || 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [userProfile]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Your Reading Recommendations
          </h1>
          <p className="text-gray-600">
            Curated books based on your profile and interests
          </p>
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