import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateBookResponse = async (userProfile, message, chatHistory = []) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a knowledgeable book recommendation assistant. 
            Current user profile:
            - Interests: ${userProfile.interests.join(', ')}
            - Inspirations: ${userProfile.inspirations.join(', ')}
            Consider this context when providing recommendations and discussing books.`
        },
        ...chatHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return {
      content: response.choices[0].message.content,
      prefills: generateFollowUpQuestions(response.choices[0].message.content)
    };
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};

const generateFollowUpQuestions = (response) => {
  return [
    "What aspects of this topic interest you the most?",
    "Would you like to explore similar books in this area?",
    "How does this relate to your current reading goals?"
  ];
};