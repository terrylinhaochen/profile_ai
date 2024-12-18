'use client';
import React, { useState } from 'react';
import { Book, Brain, Target, User, History, MessageSquare, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProfile } from '../app/context/ProfileContext';

const ProfilePage = ({ userProfile }) => {
  const [showHistory, setShowHistory] = useState(false);
  const router = useRouter();
  const { clearProfile } = useProfile();

  const handleRefillOnboarding = () => {
    clearProfile();
    router.push('/');
  };

  const categories = [
    {
      title: "Reading Profile",
      icon: <Book className="w-5 h-5" />,
      content: userProfile?.reading || "No reading profile information yet",
      color: "blue"
    },
    {
      title: "Interests",
      icon: <Brain className="w-5 h-5" />,
      content: userProfile?.interests || "No interests recorded yet",
      color: "purple"
    },
    {
      title: "Motivation",
      icon: <Target className="w-5 h-5" />,
      content: userProfile?.motivation || "No motivation information yet",
      color: "green"
    },
    {
      title: "Personal Context",
      icon: <User className="w-5 h-5" />,
      content: userProfile?.personal || "No personal context added yet",
      color: "orange"
    },
    {
      title: "Preferences",
      icon: <History className="w-5 h-5" />,
      content: userProfile?.preferences || "No preferences set yet",
      color: "pink"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with both buttons */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Your Profile</h1>
            <p className="text-gray-600">Based on your interactions and preferences</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/chat')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg 
                       hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Start Chat
            </button>
            <button
              onClick={handleRefillOnboarding}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg 
                       hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refill Onboarding
            </button>
          </div>
        </div>

        {/* Last Session Summary - Show only if there's recent session */}
        {userProfile?.sessionHistory?.length > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
            <h2 className="text-sm font-medium text-blue-800 mb-2">Last Session Insights</h2>
            <div className="text-sm text-blue-600">
              {userProfile.sessionHistory[userProfile.sessionHistory.length - 1].insights.map((insight, idx) => (
                <p key={idx}>• {insight}</p>
              ))}
            </div>
          </div>
        )}

        {/* Profile Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => (
            <div
              key={category.title}
              className={`bg-white rounded-lg border border-gray-200 p-4 
                       hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-${category.color}-50 
                              text-${category.color}-500`}>
                  {category.icon}
                </div>
                <h2 className="font-medium text-gray-900">{category.title}</h2>
              </div>
              <div className="text-gray-600 text-sm whitespace-pre-wrap">
                {category.content}
              </div>
            </div>
          ))}
        </div>

        {/* Session History Toggle */}
        {userProfile?.sessionHistory?.length > 0 && (
          <div className="mt-8">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm text-gray-600 hover:text-gray-900 
                       flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              {showHistory ? 'Hide History' : 'Show History'}
            </button>

            {/* Session History */}
            {showHistory && (
              <div className="mt-4 space-y-4">
                {userProfile.sessionHistory.map((session, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        Session {userProfile.sessionHistory.length - idx}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(session.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {session.insights.map((insight, i) => (
                        <p key={i} className="mb-1">• {insight}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;