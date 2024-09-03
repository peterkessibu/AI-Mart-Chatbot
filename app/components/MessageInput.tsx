"use client";

import { useState, useCallback } from "react";

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

export default function MessageInput({ onSendMessage, isLoading }: MessageInputProps) {
  const [message, setMessage] = useState<string>("");

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        onSendMessage(message).then(() => setMessage(""));
      }
    },
    [message, onSendMessage]
  );

  const handleSendMessage = useCallback(() => {
    if (message.trim()) {
      onSendMessage(message).then(() => setMessage(""));
    }
  }, [message, onSendMessage]);

  return (
    <div className="flex flex-col space-y-3 mt-4">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        className="w-full px-4 py-2 text-black bg-white border border-[#7f5aa3] rounded-lg focus:outline-none focus:border-purple-500 resize-none text-xs sm:text-sm md:text-base lg:text-lg"
        placeholder="Type your message here..."
        rows={3}
      />
      <button
        onClick={handleSendMessage}
        className="bg-[#591a97] text-white p-2 text-xs sm:text-sm md:text-base lg:text-lg w-32 rounded-lg hover:bg-[#7f5aa3] self-start active:bg-[#862edf]"
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send"}
      </button>
    </div>
  );
}
