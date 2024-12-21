import OpenAI from 'openai';
import { logger } from './logger';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Helper function to handle OpenAI chat completions
export async function generateAIResponse(messages, options = {}) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      temperature: options.temperature || 0.7,
      ...options
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate AI response');
  }
}

const RESPONSE_FORMAT = `For every response, provide:
1. A clear, concise main answer (2-3 sentences)
2. 1-2 Learning aids that enhance understanding:
   - Think: thought-provoking discussion prompts
   - Why: explanations of significance
   - List: key points or examples
   - Background: historical or contextual information
   - Explore: connections to other works or ideas
3. Three follow-up questions
4. Optional audio transcript for key concepts

Format as JSON:
{
  "content": "main answer here",
  "learningAids": [
    {
      "type": "think|why|list|background|explore",
      "title": "aid title",
      "content": "detailed content"
    }
  ],
  "prefills": ["follow-up 1", "follow-up 2", "follow-up 3"],
  "audioTranscript": "optional transcript for text-to-speech"
}`;

// Add to your existing RESPONSE_FORMAT
const EXPLORATION_GUIDE_FORMAT = `
Response should be JSON with an explorationGuide object containing categories as keys and arrays of topics as values.
Include detailed follow-up questions in the prefills array. These questions should be specific to the book and the topics and be thought provoking.
Format the response as a JSON object with the following structure:
{
  "explorationGuide": {
    "Themes": ["Power & Control", "Truth & Reality", "Surveillance State"],
    "Characters": ["Winston Smith", "Julia", "O'Brien"],
    "Symbolism": ["Room 101", "Telescreens", "Victory Gin"]
  },
  "content": "Let's explore these aspects of the book...",
  "prefills": [
    "What parallels can we draw between the surveillance methods in 1984 and modern digital surveillance?",
    "What does Room 101 symbolize beyond just a torture chamber? How does it represent the Party's ultimate power?",
    "How does Winston's character development reflect the struggle between individuality and conformity?"
  ]
}`;

// Add this helper function before generateBookResponse
const extractJSONFromResponse = (response) => {
  try {
    // First try to parse the entire response as JSON
    return JSON.parse(response);
  } catch (e) {
    try {
      // If that fails, try to find and parse a JSON block within the response
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || 
                       response.match(/{[\s\S]*}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1] || jsonMatch[0]);
      }

      // If no JSON found, return a formatted response
      return {
        content: response,
        learningAids: [],
        prefills: []
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return {
        content: response,
        learningAids: [],
        prefills: []
      };
    }
  }
};

const generateBookResponse = async (book, userInput, context = {}) => {
  try {
    logger.info('Generating book response', { book: book.title, context });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a knowledgeable literary assistant discussing ${book.title}.`
        },
        {
          role: "user",
          content: userInput
        }
      ],
      temperature: 0.7
    });

    logger.debug('OpenAI response received', { 
      responseLength: completion.choices[0].message.content.length 
    });

    return {
      content: completion.choices[0].message.content,
      learningAids: [],
      prefills: []
    };
  } catch (error) {
    logger.error('Error generating response', error);
    throw error;
  }
};

const generateBookOverview = async (book) => {
  // Implementation
};

const generateReflectionPrompts = async (book) => {
  // Implementation
};

// Single export statement at the end
export {
  generateBookResponse,
  generateBookOverview,
  generateReflectionPrompts
};
