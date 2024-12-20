import OpenAI from 'openai';

console.log('API Key available:', !!process.env.NEXT_PUBLIC_OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function processOnboardingData(userProfile) {
  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  const prompt = `
    Based on the following user information, generate comprehensive profile sections:
    
    Age: ${userProfile.age}
    Gender: ${userProfile.gender}
    Areas of Interest: ${userProfile.areas.join(', ')}
    Inspirational Figures: ${userProfile.inspirations.join(', ')}
    LinkedIn URL: ${userProfile.linkedinUrl || 'Not provided'}

    Please provide detailed, natural-language responses for each section:
    1. Reading Profile & Preferences: Describe their learning style and preferences based on their areas of interest
    2. Interests & Expertise: Analyze their chosen areas and potential expertise
    3. Motivation & Goals: Based on their inspirational figures and areas of interest
    4. Personal Context: Synthesize their demographic info and professional context

    Format the response as a JSON object with keys: reading, interests, motivation, personal
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional profile analyzer that creates detailed, natural-language descriptions of user profiles based on their information."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    // Parse the response to ensure it's in the correct format
    const response = JSON.parse(completion.choices[0].message.content);
    return response;
  } catch (error) {
    console.error('Error processing profile:', error);
    throw error;
  }
}