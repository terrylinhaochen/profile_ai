import { generateBookResponse, generateBookOverview, generateReflectionPrompts } from './openai';
import { database } from '../firebase/config';
import { ref, set, get, push } from 'firebase/database';
import { logger } from './logger';

export async function processBookDiscussion(book, userInput, userId, context = {}) {
  logger.info('Processing book discussion', { 
    bookId: book.id, 
    userId, 
    contextType: context.type 
  });

  if (!book?.id || !book?.title) {
    logger.error('Invalid book object', { book });
    throw new Error('Invalid book object: missing required fields');
  }

  try {
    let response = await generateBookResponse(book, userInput, context);

    // Store chat history if user is authenticated
    if (userId && userId !== 'anonymous') {
      try {
        logger.debug('Storing chat history', { userId, bookId: book.id });
        const discussionRef = ref(database, `bookDiscussions/${userId}/${book.id}`);
        const newMessageRef = push(discussionRef);

        await set(newMessageRef, {
          timestamp: new Date().toISOString(),
          type: context.type || 'question',
          input: userInput,
          response: response,
          bookId: book.id,
          bookTitle: book.title
        });
        
        logger.info('Chat history stored successfully');
      } catch (firebaseError) {
        logger.error('Error storing chat history', firebaseError);
      }
    }

    return response;
  } catch (error) {
    logger.error('Error in book discussion', error);
    throw error;
  }
}

// Add function to fetch chat history
export async function getChatHistory(userId, bookId) {
  if (!userId || !bookId) return [];

  try {
    const discussionRef = ref(database, `bookDiscussions/${userId}/${bookId}`);
    const snapshot = await get(discussionRef);
    
    if (snapshot.exists()) {
      const history = snapshot.val();
      return Object.values(history).sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
      );
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
}
