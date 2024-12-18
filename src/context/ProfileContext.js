'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config.js';

export const ProfileContext = createContext({});

export const useProfile = () => {
  return useContext(ProfileContext);
};

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch profile from Firestore
  const fetchProfile = async (userId) => {
    try {
      const docRef = doc(db, 'profiles', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Update profile in Firestore
  const updateProfile = async (newProfile) => {
    try {
      if (!user) throw new Error('No user authenticated');
      
      await setDoc(doc(db, 'profiles', user.uid), newProfile, { merge: true });
      setProfile(newProfile);
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Reset profile
  const resetProfile = async () => {
    try {
      if (!user) throw new Error('No user authenticated');
      
      const emptyProfile = {
        reading: '',
        personal: '',
        interests: '',
        motivation: '',
        preferences: '',
        sessionHistory: []
      };
      
      await setDoc(doc(db, 'profiles', user.uid), emptyProfile);
      setProfile(emptyProfile);
      return true;
    } catch (error) {
      console.error('Error resetting profile:', error);
      throw error;
    }
  };

  // Listen to user changes and fetch profile
  useEffect(() => {
    if (user) {
      fetchProfile(user.uid);
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const value = {
    profile,
    loading,
    updateProfile,
    resetProfile
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
