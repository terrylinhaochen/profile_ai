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
    Based on the following user information, generate detailed profile sections:
    
    Age: ${userProfile.age}
    Gender: ${userProfile.gender}
    Areas of Interest: ${userProfile.areas.join(', ')}
    Inspirational Figures: ${userProfile.inspirations.join(', ')}
    Additional Text: ${userProfile.textContent || 'Not provided'}

    Generate natural language descriptions for each section. Be specific and detailed:

    1. Reading Profile: Analyze their potential learning style and reading preferences based on their interests and background.
    2. Interests & Expertise: Create a narrative about their interests, potential skills, and areas of expertise.
    3. Motivation & Goals: Based on their inspirational figures and interests, describe their likely motivations and aspirations.
    4. Personal Context: Create a comprehensive personal profile combining their demographic info and personal details.

    Return ONLY a JSON object with these exact keys: reading, interests, motivation, personal
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional profile analyzer. Create detailed, natural-language descriptions based on user information. Focus on insights and connections between different aspects of their profile."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const response = JSON.parse(completion.choices[0].message.content);
    return response;
  } catch (error) {
    console.error('Error processing profile:', error);
    throw error;
  }
}