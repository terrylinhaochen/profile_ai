'use client';
import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import { auth } from '../../firebase/config';
import { ref, get, set, onValue } from 'firebase/database';
import { database } from '../../firebase/config';
import { generateRecommendations } from '../../utils/recommendationsProcessor';
import TopOfMindSection from './TopOfMindSection';
import CareerGrowthSection from './CareerGrowthSection';
import PersonalInterestsSection from './PersonalInterestsSection';
import LoadingSpinner from '../shared/LoadingSpinner';

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { profile } = useProfile();

  useEffect(() => {
    if (auth.currentUser) {
      const recommendationsRef = ref(database, `recommendations/${auth.currentUser.uid}`);
      const unsubscribe = onValue(recommendationsRef, (snapshot) => {
        if (snapshot.exists()) {
          setRecommendations(snapshot.val());
          setLoading(false);
        }
      });

      return () => unsubscribe();
    }
  }, []);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!profile) {
        throw new Error('Profile not found. Please complete your profile first.');
      }

      const newRecommendations = await generateRecommendations(profile);
      const recommendationsRef = ref(database, `recommendations/${auth.currentUser.uid}`);
      await set(recommendationsRef, newRecommendations);
      
      setRecommendations(newRecommendations);
    } catch (error) {
      console.error('Error refreshing recommendations:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
          onClick={handleRefresh}
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
      ) : null}
    </div>
  );
};

export default RecommendationsPage;