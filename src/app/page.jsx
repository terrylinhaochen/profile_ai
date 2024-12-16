"use client";

import { useState } from 'react';
import UserOnboardingFlow from '../components/UserOnboardingFlow';
import ChatInterface from '../components/ChatInterface';

export default function Home() {
  const [userProfile, setUserProfile] = useState(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  const handleProfileUpdate = (newProfile) => {
    setUserProfile(newProfile);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {!isOnboardingComplete ? (
        <UserOnboardingFlow 
          onComplete={(profile) => {
            setUserProfile(profile);
            setIsOnboardingComplete(true);
          }}
        />
      ) : (
        <ChatInterface 
          userProfile={userProfile}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
}