import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const CHAT_ANALYSIS_PROMPT = `
Analyze this chat history and extract (remember to be concise):
1. Key insights and takeaways
2. Main topics discussed
3. Reading preferences and interests
4. Areas of focus

Format response as JSON:
{
  "keyTakeaways": ["insight 1", "insight 2", ...],
  "topics": ["topic 1", "topic 2", ...],
  "preferences": ["preference 1", "preference 2", ...],
  "focusAreas": ["area 1", "area 2", ...]
}`;

export const processEndChat = async (chatHistory, book, userId) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: CHAT_ANALYSIS_PROMPT
        },
        {
          role: "user",
          content: JSON.stringify({
            book: book,
            chatHistory: chatHistory
          })
        }
      ],
      temperature: 0.7
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('Error processing chat:', error);
    throw error;
  }
}; 