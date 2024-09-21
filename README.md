
# AI Interview Preparation Chatbot

This project is an AI-powered chatbot designed to help with ustomer service of a mart. It is built with **Next.js**, **Firebase** for authentication and database storage, and **TailwindCSS** for UI styling. The chatbot interacts with users, providing assistance for items and overall mart day-to-day task.

## Features

- **User Authentication**: Google Sign-In using Firebase Authentication.
- **Real-time Chat**: Users can ask interview-related questions, and the chatbot responds with relevant information.
- **Responsive Design**: Styled using TailwindCSS, the app is mobile-friendly and responsive.
- **Powered by OpenAI**: The chatbot uses OpenAI's GPT model for generating intelligent and relevant responses to interview questions.

## Getting Started

### Prerequisites

To run this project, you’ll need to have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Firebase Account](https://firebase.google.com/)
- [OpenAI API Key](https://platform.openai.com/signup/)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/peterkessibu/AI-MART-CHATBOT.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up **Firebase**:
   - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
   - Enable **Firestore** for database storage.
   - Enable **Google Authentication** in the Firebase Authentication section.
   - Enable **Firestore Database**.

4. Create a `.env.local` file in the root of the project and add your Firebase credentials and OpenAI API key:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
   OPENAI_API_KEY=your-openai-api-key
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

### Project Structure

- `/components`: Contains React components such as `SignIn` and `Chat`.
- `/firebase.js`: Firebase configuration and helper functions.
- `/pages`: Main Next.js pages, including the home page where chat and authentication logic is implemented.
- `/styles`: Global CSS file, including TailwindCSS setup.

### Usage

1. **Sign In**: Users can sign in using their Google account.
2. **Chat**: After signing in, users can ask the AI chatbot questions related to items inventory.

### Tech Stack

- **Frontend**: Next.js, React.js
- **Backend**: Firebase (Firestore for chat storage, Authentication for user sign-in)
- **Styling**: TailwindCSS
- **AI**: OpenAI GPT model

### Future Improvements

- Add more specific question categories (e.g., time of opening, sales events, etc.).
- Add voice support for better user interaction.
- Improve chatbot accuracy with fine-tuning models such as using Pinecone and a vector database.

### License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more information.

