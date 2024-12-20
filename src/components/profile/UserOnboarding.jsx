'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { HiMail } from 'react-icons/hi';
import { processOnboardingData } from '../../utils/profileProcessor';

const UserOnboarding = () => {
  const [step, setStep] = useState(1);
  const [showAuth, setShowAuth] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [authError, setAuthError] = useState('');
  const [emailCredentials, setEmailCredentials] = useState({
    email: '',
    password: ''
  });

  const router = useRouter();
  const { user, signInWithGoogle, signInWithEmail, createUserWithEmail } = useAuth();
  const { profile, updateProfile } = useProfile();

  const defaultProfile = {
    age: '',
    gender: '',
    areas: [],
    inspirations: [],
    linkedinUrl: '',
    sessionHistory: []
  };

  const [userProfile, setUserProfile] = useState(defaultProfile);

  const areas = [
    'Emotions', 'Motivation', 'Nutrition',
    'Habits', 'Self-confidence', 'Mindset',
    'Self-care', 'Exercise', 'Empathy',
    'Love & relationships', 'Personal Finance', 'Creativity',
    'Innovation', 'Leadership', 'Technology'
  ];

  const inspirationalFigures = [
    'Steve Jobs', 'Richard Branson', 'LeBron James',
    'Oprah Winfrey', 'Emma Watson', 'Serena Williams',
    'Jeff Bezos', 'Kevin Hart', 'Brené Brown'
  ];

  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

  useEffect(() => {
    console.log('UserOnboarding useEffect - User:', user);
    console.log('UserOnboarding useEffect - Profile:', profile);
    
    if (user && profile) {
      console.log('Attempting to redirect to /profile');
      router.push('/profile').catch(console.error);
    }
  }, [user, profile, router]);

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight">Tell us about yourself</h2>
              <p className="mt-2 text-lg text-gray-600">This helps us personalize your experience</p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={userProfile.age}
                  onChange={(e) => setUserProfile(prev => ({
                    ...prev,
                    age: e.target.value
                  }))}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 
                           focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="Enter your age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <div className="grid grid-cols-2 gap-3">
                  {genderOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => setUserProfile(prev => ({
                        ...prev,
                        gender: option
                      }))}
                      className={`p-3 rounded-lg border transition-all duration-200
                        ${userProfile.gender === option
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-200'
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight">Choose areas you'd like to elevate</h2>
              <p className="mt-2 text-lg text-gray-600">The choice won't limit your experience</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-8">
              {areas.map((area) => (
                <button
                  key={area}
                  onClick={() => {
                    setUserProfile(prev => ({
                      ...prev,
                      areas: prev.areas.includes(area) 
                        ? prev.areas.filter(a => a !== area)
                        : [...prev.areas, area]
                    }));
                  }}
                  className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md
                    ${userProfile.areas.includes(area)
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 hover:border-blue-200'
                    }`}
                >
                  <span className="text-lg font-medium">{area}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight">Who inspires you the most?</h2>
              <p className="mt-2 text-lg text-gray-600">Select the figures that resonate with you</p>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-8">
              {inspirationalFigures.map((figure) => (
                <button
                  key={figure}
                  onClick={() => {
                    setUserProfile(prev => ({
                      ...prev,
                      inspirations: prev.inspirations.includes(figure)
                        ? prev.inspirations.filter(i => i !== figure)
                        : [...prev.inspirations, figure]
                    }));
                  }}
                  className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-md
                    ${userProfile.inspirations.includes(figure)
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 hover:border-blue-200'
                    }`}
                >
                  <div className="text-center space-y-3">
                    <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto"></div>
                    <p className="font-medium text-lg">{figure}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">Connect your LinkedIn</h2>
              <p className="mt-2 text-lg text-gray-600">This helps us personalize your experience (Optional)</p>
            </div>
            <div className="mt-8">
              <input
                type="text"
                placeholder="LinkedIn Profile URL"
                value={userProfile.linkedinUrl}
                onChange={(e) => setUserProfile(prev => ({
                  ...prev,
                  linkedinUrl: e.target.value
                }))}
                className="w-full p-4 rounded-xl border border-gray-200 focus:border-blue-500 
                         focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
              />
            </div>
          </div>
        );
    }
  };

  const handleAuthAndSaveProfile = async (authMethod, credentials = null) => {
    try {
      setAuthError('');
      let authUser;

      if (authMethod === 'google') {
        authUser = await signInWithGoogle();
      } else if (authMethod === 'email') {
        try {
          authUser = await signInWithEmail(credentials.email, credentials.password);
        } catch (error) {
          if (error.code === 'auth/user-not-found') {
            authUser = await createUserWithEmail(credentials.email, credentials.password);
          } else {
            throw error;
          }
        }
      }

      if (authUser) {
        const profileData = {
          ...userProfile,
          reading: `Age: ${userProfile.age}, Areas: ${userProfile.areas.join(', ')}`,
          interests: userProfile.areas.join(', '),
          motivation: `Inspired by: ${userProfile.inspirations.join(', ')}`,
          personal: `Gender: ${userProfile.gender}, Age: ${userProfile.age}`,
          preferences: userProfile.areas.join(', '),
          userId: authUser.uid,
          createdAt: new Date().toISOString()
        };

        await updateProfile(profileData);
        router.push('/profile');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setAuthError(error.message);
    }
  };

  const renderEmailForm = () => (
    <div className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={emailCredentials.email}
        onChange={(e) => setEmailCredentials(prev => ({
          ...prev,
          email: e.target.value
        }))}
        className="w-full p-3 border rounded-lg"
      />
      <input
        type="password"
        placeholder="Password"
        value={emailCredentials.password}
        onChange={(e) => setEmailCredentials(prev => ({
          ...prev,
          password: e.target.value
        }))}
        className="w-full p-3 border rounded-lg"
      />
      <button
        onClick={() => handleAuthAndSaveProfile('email', emailCredentials)}
        className="w-full p-4 bg-blue-500 text-white rounded-lg 
                 hover:bg-blue-600 transition-colors"
      >
        Continue
      </button>
    </div>
  );

  const renderAuth = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign in to save your profile</h2>
        
        {authError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {authError}
          </div>
        )}

        <div className="space-y-4">
          {showEmailForm ? (
            renderEmailForm()
          ) : (
            <>
              <button
                onClick={() => handleAuthAndSaveProfile('google')}
                className="w-full p-4 flex items-center justify-center gap-3 
                         border border-gray-200 rounded-xl hover:bg-gray-50 
                         transition-colors duration-200"
              >
                <FcGoogle className="w-6 h-6" />
                Continue with Google
              </button>
              <button
                onClick={() => setShowEmailForm(true)}
                className="w-full p-4 flex items-center justify-center gap-3 
                         bg-blue-500 text-white rounded-xl 
                         hover:bg-blue-600 transition-colors duration-200"
              >
                <HiMail className="w-6 h-6" />
                Continue with Email
              </button>
            </>
          )}
          <button
            onClick={() => {
              setShowAuth(false);
              setShowEmailForm(false);
              setAuthError('');
            }}
            className="w-full p-4 text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const handleFinalStep = async () => {
    if (!user) {
      console.log('No user, showing auth modal');
      setShowAuth(true);
    } else {
      console.log('User exists, processing and saving profile');
      try {
        // Add loading state if needed
        setAuthError(''); // Clear any previous errors
        
        // Process the profile data through LLM
        const processedProfile = await processOnboardingData(userProfile);
        
        const profileData = {
          ...userProfile,
          ...processedProfile,
          userId: user.uid,
          createdAt: new Date().toISOString()
        };

        await updateProfile(profileData);
        console.log('Profile updated successfully');
        
        window.location.href = '/profile';
      } catch (error) {
        console.error('Error saving profile:', error);
        setAuthError(error.message || 'Error processing profile');
      }
    }
  };

  if (user && profile) {
    return null;
  }

  return (
    <main className="max-w-5xl mx-auto px-4">
      {showAuth && renderAuth()}
      
      {/* Progress bar */}
      <div className="max-w-2xl mx-auto mb-12 mt-8">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 h-0.5 w-full bg-gray-200 -z-10 transform -translate-y-1/2"></div>
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center gap-2 bg-gray-50 px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center
                transition-colors duration-200 font-medium
                ${step >= stepNumber 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-600'}`}
              >
                {stepNumber}
              </div>
              <span className={`text-sm font-medium whitespace-nowrap
                ${step >= stepNumber ? 'text-blue-500' : 'text-gray-500'}`}>
                {['About You', 'Areas', 'Inspiration', 'Connect'][stepNumber - 1]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between max-w-2xl mx-auto pb-8">
        <button
          onClick={() => setStep(prev => prev - 1)}
          disabled={step === 1}
          className="px-6 py-3 text-gray-600 disabled:opacity-50 rounded-lg
                   hover:bg-gray-50 transition-colors duration-200"
        >
          Back
        </button>
        <button
          onClick={() => {
            if (step === 4) {
              handleFinalStep();
            } else {
              setStep(prev => prev + 1);
            }
          }}
          className="px-8 py-3 bg-blue-500 text-white rounded-lg 
                   hover:bg-blue-600 transition-colors duration-200"
        >
          {step === 4 ? 'View Profile' : 'Continue'}
        </button>
      </div>
    </main>
  );
};

export default UserOnboarding;