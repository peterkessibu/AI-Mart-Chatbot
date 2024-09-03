"use client";

import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebase"; // Adjust the import based on your project structure

interface AuthButtonsProps {
  user: any; // Replace with the proper Firebase User type if needed
  setUser: (user: any) => void;
}

export default function AuthButtons({ user, setUser }: AuthButtonsProps) {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <div className="flex justify-between items-center mb-4">
      {user ? (
        <>
          <span className="text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl">
            Welcome, {user.displayName}
          </span>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-xs sm:text-sm md:text-base lg:text-lg"
          >
            Sign Out
          </button>
        </>
      ) : (
        <button
          onClick={handleGoogleSignIn}
          className="bg-[#4285F4] text-white px-3 py-1 rounded-lg hover:bg-[#3367D6] text-xs sm:text-sm md:text-base lg:text-lg"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
}
