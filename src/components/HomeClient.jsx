"use client";

import { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import UserOnboarding from './profile/UserOnboarding';
import ChatInterface from './chat/ChatInterface';

export default function HomeClient() {
  const { profile, updateProfile } = useProfile();

  return (
    <div className="container mx-auto px-4">
      {!profile ? (
        <UserOnboarding onComplete={updateProfile} />
      ) : (
        <ChatInterface userProfile={profile} />
      )}
    </div>
  );
}