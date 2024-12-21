'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../firebase/config';
import { logger } from '../utils/logger';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      logger.info('Auth state changed', { 
        isAuthenticated: !!user,
        userId: user?.uid 
      });
      
      if (user) {
        const profileRef = ref(database, `profiles/${user.uid}`);
        logger.debug('Setting up profile listener', { path: `profiles/${user.uid}` });
        
        const unsubscribeProfile = onValue(profileRef, (snapshot) => {
          logger.debug('Profile data updated', { 
            exists: snapshot.exists(),
            userId: user.uid 
          });
          
          if (snapshot.exists()) {
            setProfile(snapshot.val());
          }
        }, (error) => {
          logger.error('Profile listener error', error);
        });

        return () => unsubscribeProfile();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const updateProfile = async (profileData) => {
    try {
      if (!user) {
        logger.error('Update profile failed: No user authenticated');
        throw new Error('No user authenticated');
      }

      logger.info('Updating profile', { 
        userId: user.uid,
        updateType: profileData.type || 'general'
      });

      const profileRef = ref(database, `profiles/${user.uid}`);
      await set(profileRef, profileData);
      setProfile(profileData);
      
      logger.info('Profile updated successfully');
    } catch (error) {
      logger.error('Error updating profile', error);
      throw error;
    }
  };

  const clearProfile = () => {
    logger.info('Clearing profile data');
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
