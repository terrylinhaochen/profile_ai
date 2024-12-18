"use client";

import { useState } from 'react';
import UserOnboarding from './profile/UserOnboarding';
import ChatInterface from './chat/ChatInterface';

export default function HomeClient() {
  const [userProfile, setUserProfile] = useState(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">Profile AI</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {!isOnboardingComplete ? (
          <UserOnboarding 
            onComplete={(profile) => {
              setUserProfile(profile);
              setIsOnboardingComplete(true);
            }}
          />
        ) : (
          <div className="flex gap-6">
            <ChatInterface 
              userProfile={userProfile}
              onProfileUpdate={setUserProfile}
            />
          </div>
        )}
      </main>
    </div>
  );
}