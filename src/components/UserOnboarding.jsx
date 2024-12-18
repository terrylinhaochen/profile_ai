'use client';
import { useState } from 'react';

const UserOnboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [userProfile, setUserProfile] = useState({
    interests: [],
    inspirations: [],
    areas: [],
    linkedinUrl: ''
  });

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

  const renderStep = () => {
    switch(step) {
      case 1:
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

      case 2:
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

      case 3:
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

  return (
    <div className="max-w-5xl mx-auto">
      {/* Progress bar */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex justify-between relative">
          <div className="absolute top-1/2 h-0.5 w-full bg-gray-200 -z-10"></div>
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center
                transition-colors duration-200 font-medium
                ${step >= stepNumber 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-600'}`}
              >
                {stepNumber}
              </div>
              <span className={`text-sm font-medium
                ${step >= stepNumber ? 'text-blue-500' : 'text-gray-500'}`}>
                {['Areas', 'Inspiration', 'Connect'][stepNumber - 1]}
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
      <div className="flex justify-between max-w-2xl mx-auto">
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
            if (step === 3) {
              onComplete(userProfile);
            } else {
              setStep(prev => prev + 1);
            }
          }}
          className="px-8 py-3 bg-blue-500 text-white rounded-lg 
                   hover:bg-blue-600 transition-colors duration-200"
        >
          {step === 3 ? 'Complete' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default UserOnboarding;