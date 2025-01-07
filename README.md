AI-Powered Reading Assistant

Intelligent reading companion that helps users explore and understand books deeply through AI-powered discussions and personalized recommendations.

## Features

- **Interactive Book Discussions**: Engage in meaningful conversations about books with an AI assistant that understands context and provides insightful analysis
- **Smart Book Recommendations**: Get personalized book recommendations based on your reading profile, interests, and goals
- **Learning Aids**: Access various learning tools like thinking prompts, vocabulary cards, and misconception clarifications
- **Profile-Based Personalization**: Create and maintain a reading profile that helps tailor the experience to your interests and goals
- **Progress Tracking**: Monitor your reading journey and discussion progress

## Technology Stack

- **Frontend**: Next.js with React
- **UI Framework**: Tailwind CSS
- **Authentication**: Firebase Authentication
- **Database**: Firebase Realtime Database
- **AI Integration**: OpenAI GPT-4
- **State Management**: React Context API

## Prerequisites

Before running the project, ensure you have:

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- OpenAI API key

## Environment Setup

1. Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_firebase_database_url
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd profile_ai
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## System Architecture

### Components

1. **Authentication System**
   - Handles user sign-in/sign-up using Firebase Authentication
   - Manages user sessions and protected routes
   - Components: `SignInForm.jsx`

2. **Profile Management**
   - Manages user reading profiles and preferences
   - Stores user data in Firebase Realtime Database
   - Components: `ProfilePage.jsx`

3. **Book Discussion System**
   - Facilitates AI-powered book discussions
   - Processes user questions and generates contextual responses
   - Components: `BookDiscussionPage.jsx`, `ChatPage.jsx`

4. **Recommendation Engine**
   - Generates personalized book recommendations
   - Categories: Top of Mind, Career Growth, Personal Interests
   - Components: `TopOfMindSection.jsx`, `CareerGrowthSection.jsx`, `PersonalInterestsSection.jsx`

5. **Learning Aids**
   - Provides various educational tools and prompts
   - Components: `LearningAid.jsx`

### Core Utilities

1. **AI Processing**
   - `openai.js`: Handles OpenAI API interactions
   - `bookProcessor.js`: Processes book-related queries
   - `recommendationsProcessor.js`: Generates book recommendations

2. **Firebase Integration**
   - `firebase/config.js`: Firebase configuration and initialization
   - Database operations for user profiles and chat history

### Data Flow

1. **User Authentication**
   - User signs in through Firebase Authentication
   - User profile is fetched from Firebase Realtime Database

2. **Book Discussions**
   - User inputs are processed through OpenAI
   - Responses are enhanced with learning aids and follow-up questions
   - Chat history is stored in Firebase

3. **Recommendations**
   - User profile data is analyzed
   - OpenAI generates personalized recommendations
   - Results are categorized and displayed in respective sections

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
