// src/components/UserOnboardingFlow.jsx
import React, { useState } from 'react';

const UserOnboardingFlow = ({ onComplete }) => {
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
            <h2 className="text-2xl font-semibold">Choose areas you'd like to elevate</h2>
            <p className="text-gray-500">The choice won't limit your experience</p>
            <div className="grid grid-cols-3 gap-4">
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
                  className={`p-4 rounded-lg border ${
                    userProfile.areas.includes(area)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Who inspires you the most?</h2>
            <div className="grid grid-cols-3 gap-6">
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
                  className={`p-4 rounded-lg border ${
                    userProfile.inspirations.includes(figure)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-2"></div>
                    <p className="font-medium">{figure}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Connect your LinkedIn (Optional)</h2>
            <input
              type="text"
              placeholder="LinkedIn Profile URL"
              value={userProfile.linkedinUrl}
              onChange={(e) => setUserProfile(prev => ({
                ...prev,
                linkedinUrl: e.target.value
              }))}
              className="w-full p-3 rounded-lg border focus:border-blue-500 outline-none"
            />
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress bar */}
      <div className="mb-8 flex justify-between">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center
              ${step >= stepNumber ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {stepNumber}
            </div>
            {stepNumber < 3 && (
              <div className={`w-24 h-1 mx-2
                ${step > stepNumber ? 'bg-blue-500' : 'bg-gray-200'}`} 
              />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setStep(prev => prev - 1)}
          disabled={step === 1}
          className="px-4 py-2 text-gray-600 disabled:opacity-50"
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
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {step === 3 ? 'Complete' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default UserOnboardingFlow;