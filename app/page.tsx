"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { auth, provider, signInWithPopup, signOut } from "./firebase"; 

interface Message {
  role: "assistant" | "user";
  content: string;
  id?: number; 
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm Doodo, mart assistant. How may I help?",
    },
  ]);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState(null); // State to hold the logged-in user
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(async () => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage = message;
    setMessage(""); // Clear the input field

    // Add the user's message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: userMessage },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ...messages,
          { role: "user", content: userMessage },
        ]),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body?.getReader();
      if (!reader)
        throw new Error("ReadableStream is not supported in the response");

      const decoder = new TextDecoder();
      let result = "";

      // Add a new assistant message with a unique ID
      const assistantMessageId = Date.now(); // Unique ID for the new message

      // Add the initial assistant message
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "", // Start with empty content
          id: assistantMessageId,
        },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        result += text;

        // Update the assistant message with streamed content
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const lastMessageIndex = updatedMessages.length - 1;

          // Replace the last assistant message with updated content
          updatedMessages[lastMessageIndex] = {
            role: "assistant",
            content: result,
            id: assistantMessageId,
          };

          return updatedMessages;
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content:
            "Excuse me, but I'm not available right now. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [message, isLoading, messages]);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

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
    <div className="bg-[#ceb5f7] flex justify-center items-center px-4 sm:px-6 lg:px-8 mb-7">
      <div className="w-full max-w-lg sm:max-w-xl lg:max-w-2xl h-full max-h-[80vh] sm:max-h-[700px] bg-[#f2eef7] border border-[#be9df1] shadow-md rounded-lg p-4 flex flex-col">
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
        <div className="flex-grow overflow-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {messages.map((msg, index) => (
            <div
              key={msg.id || index} // Use the unique ID if available, else fall back to index
              className={`flex ${
                msg.role === "assistant" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`text-black text-xs sm:text-sm md:text-base lg:text-lg p-3 rounded-lg border items-center ${
                  msg.role === "assistant"
                    ? "bg-[#e5daf0] border-[#752aee]"
                    : "bg-[#c99bf7] border-purple-500"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex flex-col space-y-3 mt-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full px-4 py-2 text-black bg-white border border-[#7f5aa3] rounded-lg focus:outline-none focus:border-purple-500 resize-none text-xs sm:text-sm md:text-base lg:text-lg"
            placeholder="Type your message here..."
            rows={3} // Adjust the number of rows as needed
          />
          <button
            onClick={sendMessage}
            className="bg-[#591a97] text-white p-2 text-xs sm:text-sm md:text-base lg:text-lg w-32 rounded-lg hover:bg-[#7f5aa3] self-start active:bg-[#862edf]"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}