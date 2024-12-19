'use client';
import { createContext, useContext, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const { user } = useAuth();

  const updateProfile = async (newProfile) => {
    try {
      if (!user) {
        console.error('No user authenticated');
        return;
      }
      
      await setDoc(doc(db, 'profiles', user.uid), newProfile, { merge: true });
      setProfile(newProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const clearProfile = () => {
    setProfile(null);
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, clearProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
