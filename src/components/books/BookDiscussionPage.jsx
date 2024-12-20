'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Book, Send, PlayCircle, PauseCircle, ChevronRight } from 'lucide-react';
import { LearningAidSection } from './LearningAid';
import { processBookDiscussion } from '../../utils/bookDiscussion';
import { useAuth } from '../../context/AuthContext';
import { database } from '../../firebase/config';
import { ref, get } from 'firebase/database';

const BookDiscussionPage = ({ book }) => {
  const { user } = useAuth();

  const sanitizeForFirebase = (str) => {
    return str.toLowerCase()
              .replace(/[.#$[\],\s]/g, '-')
              .replace(/[^a-z0-9-]/g, '')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '');
  };

  const [selectedBook, setSelectedBook] = useState(book ? {
    id: book.id || sanitizeForFirebase(`book-${book.title}`),
    title: book.title,
    author: book.author,
    topics: book.topics || []
  } : null);
  const [currentStep, setCurrentStep] = useState('aim');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [discussionCount, setDiscussionCount] = useState(0);
  const [explorationTopics, setExplorationTopics] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (book && !selectedBook) {
      setSelectedBook({
        id: book.id || sanitizeForFirebase(`book-${book.title}`),
        title: book.title,
        author: book.author,
        topics: book.topics || []
      });
    }
  }, [book]);

  const learningGoals = [
    {
      title: "Explore Key Ideas",
      description: "Understand the main themes and concepts",
      icon: "🎯"
    },
    {
      title: "Apply to Life",
      description: "Connect insights to personal situations",
      icon: "💡"
    },
    {
      title: "Critical Analysis",
      description: "Analyze writing style and arguments",
      icon: "🔍"
    },
    {
      title: "Historical Context",
      description: "Understand background and influence",
      icon: "📚"
    }
  ];

  const bookOverviews = {
    "1984": {
      keyIdeas: {
        background: "A dystopian vision of absolute government control",
        relevance: "Explores surveillance, propaganda, and truth manipulation",
        mainThemes: [
          "The power of surveillance and control",
          "Language as a tool of oppression",
          "The manipulation of truth and history"
        ]
      },
      lifeApplications: {
        background: "A warning about totalitarian control methods",
        relevance: "Modern parallels to privacy and technology",
        mainThemes: [
          "Recognizing manipulation tactics",
          "Importance of independent thinking",
          "Value of personal privacy"
        ]
      },
      analysis: {
        background: "Orwell's masterwork of political fiction",
        relevance: "Pioneering work in dystopian literature",
        mainThemes: [
          "Symbolism of technology and power",
          "Narrative structure and perspective",
          "Language and literary devices"
        ]
      },
      historical: {
        background: "Written in post-WW2 era",
        relevance: "Influenced by totalitarian regimes",
        mainThemes: [
          "Post-war political climate",
          "Rise of surveillance states",
          "Cold War influences"
        ]
      }
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || !selectedBook) return;

    try {
      setMessages(prev => [...prev,
        { type: 'user', content: inputValue },
        { type: 'assistant', content: 'Thinking...', loading: true }
      ]);

      const bookWithSafeId = {
        ...selectedBook,
        id: sanitizeForFirebase(selectedBook.id)
      };

      const response = await processBookDiscussion(
        bookWithSafeId,
        inputValue,
        user?.uid,
        { type: 'question' }
      );

      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          type: 'assistant',
          content: response.content,
          learningAids: response.learningAids,
          prefills: response.prefills
        }
      ]);

      setInputValue('');
      setDiscussionCount(prev => prev + 1);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          type: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again.',
        }
      ]);
    }
  };

  const handleStartDiscussion = async () => {
    setCurrentStep('talk');
    try {
      setMessages(prev => [...prev, 
        {
          type: 'assistant',
          content: 'Generating discussion points...',
          loading: true
        }
      ]);

      const initialQuestion = "What are the main themes and key points we should discuss?";
      const response = await processBookDiscussion(selectedBook, initialQuestion);
      
      setMessages(prev => [...prev.slice(0, -1), 
        {
          type: 'assistant',
          content: response.content,
          learningAids: response.learningAids,
          prefills: response.prefills
        }
      ]);
      setDiscussionCount(1);
    } catch (error) {
      console.error('Error starting discussion:', error);
      setMessages(prev => [...prev.slice(0, -1), 
        {
          type: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again.',
        }
      ]);
    }
  };

  const handleGoalSelect = async (goal) => {
    try {
      if (!selectedBook) {
        throw new Error('No book selected');
      }

      const overview = bookOverviews[selectedBook.title]?.[goal.toLowerCase().replace(/\s+/g, '')] || 
                      bookOverviews[selectedBook.title]?.keyIdeas;
      
      setCurrentStep('listen');
      setMessages(prev => [...prev, 
        {
          type: 'user',
          content: `Goal: ${goal}`
        },
        {
          type: 'assistant',
          content: "Let's start with an overview of the key concepts.",
          loading: true
        }
      ]);

      const bookWithSafeId = {
        ...selectedBook,
        id: sanitizeForFirebase(selectedBook.id)
      };

      const response = await processBookDiscussion(
        bookWithSafeId,
        `Explain the key concepts of ${selectedBook.title} focusing on ${goal}`,
        user?.uid,
        {
          type: 'overview',
          goal: goal
        }
      );

      setMessages(prev => [...prev.slice(0, -1), 
        {
          type: 'assistant',
          content: "Let's start with an overview of the key concepts.",
          overview: overview,
          showPlayButton: true,
          showStartDiscussion: true,
          learningAids: response.learningAids,
          prefills: response.prefills
        }
      ]);
    } catch (error) {
      console.error('Error in goal selection:', error);
      setMessages(prev => [...prev.slice(0, -1),
        {
          type: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again.',
        }
      ]);
    }
  };

  const handleCardClick = async (aid) => {
    try {
      if (!selectedBook) {
        throw new Error('No book selected');
      }

      setMessages(prev => [...prev,
        { 
          type: 'user', 
          content: `Tell me more about ${aid.title} in ${selectedBook.title}` 
        },
        { 
          type: 'assistant', 
          content: 'Analyzing this aspect...', 
          loading: true 
        }
      ]);

      const bookWithSafeId = {
        ...selectedBook,
        id: sanitizeForFirebase(selectedBook.id)
      };

      const response = await processBookDiscussion(
        bookWithSafeId,
        `Can you elaborate on ${aid.title} in ${selectedBook.title}?`,
        user?.uid,
        { 
          type: 'exploration',
          topic: aid.title 
        }
      );

      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          type: 'assistant',
          content: response.content,
          learningAids: response.learningAids,
          prefills: response.prefills
        }
      ]);

      setDiscussionCount(prev => prev + 1);
    } catch (error) {
      console.error('Error in card click:', error);
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          type: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again.',
        }
      ]);
    }
  };

  const handlePrefillClick = async (prefill) => {
    try {
      if (!selectedBook) {
        throw new Error('No book selected');
      }

      setMessages(prev => [...prev,
        { type: 'user', content: prefill },
        { type: 'assistant', content: 'Thinking...', loading: true }
      ]);

      const bookWithSafeId = {
        ...selectedBook,
        id: sanitizeForFirebase(selectedBook.id)
      };

      const response = await processBookDiscussion(
        bookWithSafeId,
        prefill,
        user?.uid,
        { type: 'question' }
      );

      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          type: 'assistant',
          content: response.content,
          learningAids: response.learningAids,
          prefills: response.prefills
        }
      ]);

      setDiscussionCount(prev => prev + 1);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          type: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again.',
        }
      ]);
    }
  };

  useEffect(() => {
    const loadChatHistory = async () => {
      if (user?.uid && selectedBook?.id) {
        try {
          const safeBookId = sanitizeForFirebase(selectedBook.id);
          const discussionRef = ref(database, `bookDiscussions/${user.uid}/${safeBookId}`);
          const snapshot = await get(discussionRef);
          
          if (snapshot.exists()) {
            const history = snapshot.val();
            const historicMessages = Object.values(history)
              .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
              .map(entry => ([
                { type: 'user', content: entry.input },
                { 
                  type: 'assistant', 
                  content: entry.response.content,
                  learningAids: entry.response.learningAids,
                  prefills: entry.response.prefills
                }
              ])).flat();
            
            setMessages(historicMessages);
          }
        } catch (error) {
          console.error('Error loading chat history:', error);
        }
      }
    };

    loadChatHistory();
  }, [user?.uid, selectedBook?.id]);

  useEffect(() => {
    if (currentStep === 'aim' && messages.length === 0) {
      setMessages([
        {
          type: 'assistant',
          content: 'What would you like to focus on in our discussion?',
          goalOptions: learningGoals
        }
      ]);
    }
  }, [currentStep]);

  useEffect(() => {
    const generateExplorationTopics = async () => {
      if (selectedBook) {
        try {
          const response = await processBookDiscussion(
            selectedBook,
            "Generate a structured exploration guide with main categories and specific topics to explore",
            user?.uid,
            { 
              type: 'exploration_guide',
              format: {
                categories: ["Context", "Themes", "Characters"],
                topicsPerCategory: 2-3,
                includeQuestions: true
              }
            }
          );
          
          setExplorationTopics(response.explorationGuide);
        } catch (error) {
          console.error('Error generating exploration topics:', error);
        }
      }
    };

    generateExplorationTopics();
  }, [selectedBook]);

  const handleTopicClick = async (category, topic) => {
    try {
      setMessages(prev => [...prev,
        { 
          type: 'user', 
          content: `Let's explore ${topic} in ${selectedBook.title}` 
        },
        { 
          type: 'assistant', 
          content: 'Analyzing this topic...', 
          loading: true 
        }
      ]);

      const response = await processBookDiscussion(
        selectedBook,
        `Analyze ${topic} in ${selectedBook.title}, focusing on its significance within the ${category.toLowerCase()} of the book.`,
        user?.uid,
        { 
          type: 'topic_exploration',
          category: category,
          topic: topic
        }
      );

      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          type: 'assistant',
          content: response.content,
          learningAids: response.learningAids,
          prefills: response.prefills
        }
      ]);
    } catch (error) {
      console.error('Error exploring topic:', error);
      // ... error handling
    }
  };

  const renderMessage = (message) => (
    <div className={`${message.type === 'user' ? 'bg-blue-50' : 'bg-white'} p-4 rounded-lg`}>
      <p className="mb-4">{message.content}</p>
      
      {/* Goal Selection */}
      {message.goalOptions && (
        <div className="grid grid-cols-1 gap-4">
          {message.goalOptions.map((goal, idx) => (
            <button
              key={idx}
              onClick={() => handleGoalSelect(goal.title)}
              className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm 
                        hover:shadow-md transition-all border border-gray-200"
            >
              <span className="text-2xl">{goal.icon}</span>
              <div>
                <h3 className="font-medium text-gray-900">{goal.title}</h3>
                <p className="text-sm text-gray-600">{goal.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Overview and Audio Player */}
      {message.overview && (
        <div className="mt-4 space-y-4">
          {message.showPlayButton && (
            <div className="flex justify-center mb-6">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-blue-500 hover:text-blue-600"
              >
                {isPlaying ? (
                  <PauseCircle className="w-16 h-16" />
                ) : (
                  <PlayCircle className="w-16 h-16" />
                )}
              </button>
            </div>
          )}

          <div className="space-y-4">
            <section>
              <h3 className="font-medium mb-2">Background</h3>
              <p className="text-gray-600">{message.overview.background}</p>
            </section>
            <section>
              <h3 className="font-medium mb-2">Relevance</h3>
              <p className="text-gray-600">{message.overview.relevance}</p>
            </section>
            <section>
              <h3 className="font-medium mb-2">Key Points</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                {message.overview.mainThemes?.map((theme, idx) => (
                  <li key={idx}>{theme}</li>
                ))}
              </ul>
            </section>
          </div>

          {message.showStartDiscussion && (
            <button
              onClick={handleStartDiscussion}
              className="w-full mt-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Start Discussion
            </button>
          )}
        </div>
      )}

      {/* Learning Aids */}
      {message.learningAids && (
        <div className="mt-4 space-y-3">
          {message.learningAids.map((aid, idx) => (
            <div
              key={idx}
              onClick={() => handleCardClick(aid)}
              className="cursor-pointer group transition-all duration-200"
            >
              <LearningAidSection 
                title={aid.title}
                type={aid.type}
                className="hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div className="text-gray-600 group-hover:text-gray-900">
                  {aid.content}
                </div>
                <div className="mt-2 text-sm text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Click to explore this section in depth →
                </div>
              </LearningAidSection>
            </div>
          ))}
        </div>
      )}

      {/* Loading State */}
      {message.loading && (
        <div className="flex items-center gap-2 text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
          <span className="text-sm">Generating response...</span>
        </div>
      )}

      {/* Follow-up Questions */}
      {!message.loading && message.prefills && message.prefills.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-medium text-gray-700">Relevant Questions:</h4>
          <div className="flex flex-wrap gap-2">
            {message.prefills.map((prefill, idx) => (
              <button
                key={idx}
                onClick={() => handlePrefillClick(prefill)}
                className="px-3 py-1 bg-white text-gray-600 rounded-full text-sm 
                         hover:bg-blue-50 hover:text-blue-600 transition-colors
                         border border-gray-200"
              >
                {prefill}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSidebar = () => (
    <div className="w-64 flex-shrink-0 space-y-4">
      {/* Book Details Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="font-semibold text-gray-900 mb-4">Book Details</h2>
        {selectedBook && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{selectedBook.title}</h3>
              <p className="text-sm text-gray-500">by {selectedBook.author}</p>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Discussion Progress</h4>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${Math.min((discussionCount / 5) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {discussionCount} messages
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Areas to Explore Section */}
      {explorationTopics && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Areas to Explore</h2>
          <div className="space-y-6">
            {Object.entries(explorationTopics).map(([category, topics]) => (
              <div key={category} className="space-y-2">
                <h3 className="text-lg font-medium text-gray-800">{category}</h3>
                <div className="space-y-1">
                  {topics.map((topic, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTopicClick(category, topic)}
                      className="w-full text-left px-2 py-1.5 text-gray-600 hover:text-gray-900 
                               hover:bg-gray-50 rounded-md transition-colors duration-150"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <h1 className="text-xl font-semibold text-gray-900">ReadAI</h1>
        </div>
      </header>

      {/* Add a spacer div to prevent content overlap */}
      <div className="h-[48px]"></div>

      <main className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-6 h-[calc(100vh-64px)]">
          {renderSidebar()}

          {/* Main chat container */}
          <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col overflow-hidden">
            {selectedBook && (
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b flex-shrink-0">
                {['aim', 'listen', 'talk', 'reflect'].map((step, idx) => (
                  <div 
                    key={step} 
                    className="flex items-center"
                  >
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-sm
                      ${currentStep === step ? 'bg-blue-500 text-white' : 'bg-gray-200'}
                    `}>
                      {idx + 1}
                    </div>
                    <span className={`ml-2 text-sm ${currentStep === step ? 'text-blue-500' : 'text-gray-500'}`}>
                      {step.charAt(0).toUpperCase() + step.slice(1)}
                    </span>
                    {idx < 3 && <ChevronRight className="mx-2 text-gray-400 w-4 h-4" />}
                  </div>
                ))}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, idx) => (
                <div key={idx}>
                  {renderMessage(message)}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter your question or thoughts..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim()}
                  className={`p-2 rounded-lg flex items-center justify-center ${
                    !inputValue.trim()
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookDiscussionPage;
