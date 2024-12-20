'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Book, Brain, Target, User, RefreshCw } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import { ref, set, onValue } from 'firebase/database';
import { database } from '../../firebase/config';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const { user } = useAuth();
  const { profile, clearProfile } = useProfile();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);

  useEffect(() => {
    if (user) {
      const profileRef = ref(database, `profiles/${user.uid}`);
      const unsubscribe = onValue(profileRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setProfileData(data);
        }
        setIsLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleEditProfile = async () => {
    await clearProfile();
    router.push('/');
  };

  const handleSaveEdit = async () => {
    try {
      const updatedProfile = {
        ...profileData,
        ...editedProfile,
        lastUpdated: new Date().toISOString()
      };

      const profileRef = ref(database, `profiles/${user.uid}`);
      await set(profileRef, updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const categories = [
    {
      title: "Personal Context",
      icon: <User className="w-5 h-5" />,
      content: profileData?.personal || "No personal information available",
      color: "purple",
    },
    {
      title: "Reading Profile & Preferences",
      icon: <Book className="w-5 h-5" />,
      content: profileData?.reading || "No reading profile information available",
      color: "blue",
    },
    {
      title: "Interests & Expertise",
      icon: <Brain className="w-5 h-5" />,
      content: profileData?.interests || "No interests recorded yet",
      color: "green",
    },
    {
      title: "Motivation & Goals",
      icon: <Target className="w-5 h-5" />,
      content: profileData?.motivation || "No motivation information yet",
      color: "orange",
    }
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
        <button
          onClick={handleEditProfile}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg 
                   hover:bg-blue-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Edit Profile
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {categories.map((category) => (
          <div
            key={category.title}
            className="bg-white rounded-lg border border-gray-200 p-6 
                     hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg bg-${category.color}-50 
                            text-${category.color}-500`}>
                {category.icon}
              </div>
              <h2 className="font-medium text-lg text-gray-900">{category.title}</h2>
            </div>
            {isEditing ? (
              <textarea
                value={editedProfile?.[category.key] || category.content}
                onChange={(e) => setEditedProfile(prev => ({
                  ...prev,
                  [category.key]: e.target.value
                }))}
                className="w-full p-3 border rounded-lg"
                rows={4}
              />
            ) : (
              <div className="text-gray-600 text-base leading-relaxed whitespace-pre-wrap">
                {category.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;