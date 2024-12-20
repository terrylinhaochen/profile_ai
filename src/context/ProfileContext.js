'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../firebase/config';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Listen for profile updates
      const profileRef = ref(database, `profiles/${user.uid}`);
      const unsubscribe = onValue(profileRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setProfile(data);
        }
      });

      return () => unsubscribe();
    } else {
      setProfile(null);
    }
  }, [user]);

  const updateProfile = async (profileData) => {
    try {
      if (!user) {
        console.error('No user authenticated');
        return;
      }

      const profileRef = ref(database, `profiles/${user.uid}`);
      await set(profileRef, profileData);
      setProfile(profileData);
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
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
