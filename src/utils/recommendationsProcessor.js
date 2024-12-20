import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateRecommendations(profile) {
  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  const prompt = `Generate 5 book recommendations for each category based on this user profile:
    
Reading Profile: ${profile.reading}
Interests & Expertise: ${profile.interests}
Motivation & Goals: ${profile.motivation}
Personal Context: ${profile.personal}

Provide exactly 5 books for each category: Top of Mind, Career Growth, and Personal Interests.
Return ONLY a valid JSON object with this exact structure (no markdown, no backticks):
{
  "topOfMind": [
    {
      "title": "Book Title",
      "author": "Author Name",
      "description": "Brief description",
      "relevance": "Why this book is relevant to the user",
      "keyTakeaways": ["Key point 1", "Key point 2", "Key point 3"]
    }
  ],
  "careerGrowth": [
    {
      "title": "Book Title",
      "author": "Author Name",
      "description": "Brief description",
      "relevance": "Why this book is relevant to the user",
      "keyTakeaways": ["Key point 1", "Key point 2", "Key point 3"]
    }
  ],
  "personalInterests": [
    {
      "title": "Book Title",
      "author": "Author Name",
      "description": "Brief description",
      "relevance": "Why this book is relevant to the user",
      "keyTakeaways": ["Key point 1", "Key point 2", "Key point 3"]
    }
  ]
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a book recommendation system. Return ONLY valid JSON without any markdown formatting or explanation. Each category must have exactly 5 book recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    let content = completion.choices[0].message.content;
    
    // Clean up the response to ensure valid JSON
    content = content.trim();
    if (content.startsWith('```')) {
      content = content.replace(/```json\n?|\n?```/g, '');
    }

    // Parse the cleaned JSON
    const recommendations = JSON.parse(content);

    // Validate the structure
    if (!recommendations.topOfMind || !recommendations.careerGrowth || !recommendations.personalInterests) {
      throw new Error('Invalid recommendation structure');
    }

    // Ensure each category has exactly 5 recommendations
    if (recommendations.topOfMind.length !== 5 || 
        recommendations.careerGrowth.length !== 5 || 
        recommendations.personalInterests.length !== 5) {
      throw new Error('Each category must have exactly 5 recommendations');
    }

    return recommendations;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    throw new Error('Failed to generate recommendations: ' + error.message);
  }
}