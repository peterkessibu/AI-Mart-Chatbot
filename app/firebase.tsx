import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCLXOLnWnC3yy3WYzZjuZEBxPBJpn4J06w",
    authDomain: "ai-chatbot-b04ac.firebaseapp.com",
    projectId: "ai-chatbot-b04ac",
    storageBucket: "ai-chatbot-b04ac.appspot.com",
    messagingSenderId: "594380409005",
    appId: "1:594380409005:web:84f9e7f2e7288f1136de24"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
