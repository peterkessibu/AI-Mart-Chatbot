"use client";

import { Message } from "../types"; // Move the Message interface to a types file
import { useRef, useEffect, useCallback } from "react";

interface ChatWindowProps {
  messages: Message[];
}

export default function ChatWindow({ messages }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <div className="flex-grow overflow-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
      {messages.map((msg, index) => (
        <div
          key={msg.id || index}
          className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
        >
          <div
            className={`text-black text-xs sm:text-sm md:text-base lg:text-lg p-3 rounded-lg border items-center ${
              msg.role === "assistant" ? "bg-[#e5daf0] border-[#752aee]" : "bg-[#c99bf7] border-purple-500"
            }`}
          >
            {msg.content}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
