'use client';
import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import { auth } from '../../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import TopOfMindSection from './TopOfMindSection';
import CareerGrowthSection from './CareerGrowthSection';
import PersonalInterestsSection from './PersonalInterestsSection';
import LoadingSpinner from '../shared/LoadingSpinner';

// Sample recommendations (move this to a separate file if you prefer)
const sampleRecommendations = {
  topOfMind: [
    {
      title: "Deep Work",
      author: "Cal Newport",
      description: "Rules for Focused Success in a Distracted World",
      relevance: "Helps improve concentration and productivity",
      keyTakeaways: [
        "Eliminate distractions to focus deeply",
        "Schedule deep work sessions",
        "Build routines and rituals"
      ]
    }
  ],
  careerGrowth: [
    {
      title: "Atomic Habits",
      author: "James Clear",
      description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
      relevance: "Perfect for developing professional habits",
      keyTakeaways: [
        "Make small changes for big results",
        "Focus on systems over goals",
        "Use habit stacking"
      ]
    }
  ],
  personalInterests: [
    {
      title: "The Psychology of Money",
      author: "Morgan Housel",
      description: "Timeless lessons on wealth, greed, and happiness",
      relevance: "Understanding personal finance and behavior",
      keyTakeaways: [
        "Long-term thinking is key",
        "Luck and risk are important factors",
        "Manage your psychology around money"
      ]
    }
  ]
};

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { profile } = useProfile();

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      if (auth.currentUser) {
        // Try to get existing recommendations from Firestore
        const docRef = doc(db, 'recommendations', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setRecommendations(docSnap.data());
          return;
        }
        
        // If no existing recommendations, save and use sample data
        await setDoc(docRef, sampleRecommendations);
        setRecommendations(sampleRecommendations);
      } else {
        // If not logged in, just use sample data
        setRecommendations(sampleRecommendations);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError(error.message || 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [profile]);

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