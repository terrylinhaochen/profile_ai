'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Book, Brain, Target, User } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import { ref, set, onValue } from 'firebase/database';
import { database } from '../../firebase/config';

const ProfilePage = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (user) {
      const profileRef = ref(database, `profiles/${user.uid}`);
      
      // Listen for profile updates
      const unsubscribe = onValue(profileRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setProfileData(data);
        }
      });

      return () => unsubscribe();
    }
  }, [user]);

  const categories = [
    {
      title: "Personal Context",
      icon: <User className="w-5 h-5" />,
      content: profileData?.personal || "No personal information available",
      color: "purple",
      span: "col-span-full" // Full width
    },
    {
      title: "Reading Profile & Preferences",
      icon: <Book className="w-5 h-5" />,
      content: profileData?.reading || "No reading profile information available",
      color: "blue",
      span: "col-span-full" // Full width
    },
    {
      title: "Interests & Expertise",
      icon: <Brain className="w-5 h-5" />,
      content: profileData?.interests || "No interests recorded yet",
      color: "green",
      span: "col-span-full" // Full width
    },
    {
      title: "Motivation & Goals",
      icon: <Target className="w-5 h-5" />,
      content: profileData?.motivation || "No motivation information yet",
      color: "orange",
      span: "col-span-full" // Full width
    }
  ];

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
      
      <div className="grid grid-cols-1 gap-6"> {/* Changed to single column */}
        {categories.map((category) => (
          <div
            key={category.title}
            className={`bg-white rounded-lg border border-gray-200 p-6 
                     hover:shadow-md transition-shadow ${category.span}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg bg-${category.color}-50 
                            text-${category.color}-500`}>
                {category.icon}
              </div>
              <h2 className="font-medium text-lg text-gray-900">{category.title}</h2>
            </div>
            <div className="text-gray-600 text-base leading-relaxed whitespace-pre-wrap">
              {category.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;