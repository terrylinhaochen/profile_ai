import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const extractBookFromQuestion = async (question) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Extract book information from the user's question. If a book is mentioned, return its details. If no book is clearly mentioned, return null.
          Format response as JSON:
          {
            "bookFound": boolean,
            "title": "string",
            "author": "string" // if known
          }`
        },
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0.1
    });

    const response = JSON.parse(completion.choices[0].message.content);
    return response;
  } catch (error) {
    console.error('Error extracting book:', error);
    return null;
  }
}; 