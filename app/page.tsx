'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  id?: number; // Optional ID for unique identification
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Paul, your AI mart assistant. How may I help?",
    },
  ]);
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(async () => {
    if (!message.trim() || isLoading) return;
  
    setIsLoading(true);
    const userMessage = message;
    setMessage(''); // Clear the input field
  
    // Add the user's message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: userMessage },
    ]);
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: userMessage }]),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const reader = response.body?.getReader();
      if (!reader) throw new Error('ReadableStream is not supported in the response');
  
      const decoder = new TextDecoder();
      let result = '';
  
      // Add a new assistant message with a unique ID
      const assistantMessageId = Date.now(); // Unique ID for the new message
  
      // Add the initial assistant message
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'assistant',
          content: '', // Start with empty content
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
            role: 'assistant',
            content: result,
            id: assistantMessageId,
          };
  
          return updatedMessages;
        });
      }
  
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [message, isLoading, messages]);
  

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  return (
    <div className="bg-[#ceb5f7] min-h-screen flex justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg sm:max-w-xl lg:max-w-2xl h-full max-h-[80vh] sm:max-h-[700px] bg-[#dbcaec] border border-[#be9df1] shadow-md rounded-lg p-4 flex flex-col">
        <div className="flex-grow overflow-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {messages.map((msg, index) => (
            <div
              key={msg.id || index} // Use the unique ID if available, else fall back to index
              className={`flex ${
                msg.role === 'assistant' ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`text-black text-base p-3 rounded-lg border items-center ${
                  msg.role === 'assistant' ? 'bg-[#f0f0f0] border-[#7c35ee]' : 'bg-[#e0e0ff] border-purple-500'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex space-x-3 mt-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full px-4 py-2 text-black bg-white border border-[#7F5AA3] rounded-lg focus:outline-none focus:border-purple-500 resize-none flex-grow"
            placeholder="Type your message here..."
            rows={2} // Adjust the number of rows as needed
          />
          <button
            onClick={sendMessage}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
