// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Define the system prompt with a clear and structured message
const systemPrompt = `
  Welcome to Doodo AI-Mart-Customer Service Assistant, your go-to support for all AI products and services.
  As your virtual assistant, I’m here to:
  
  1. Provide detailed and accurate product information.
  2. Assist with selecting the right products based on your needs.
  3. Clarify pricing, promotions, and availability.
  4. Help with placing orders, tracking shipments, processing returns, exchanges, and refunds.
  5. Provide real-time updates on order status.
  6. Troubleshoot product-related issues and guide you through setup, installation, and usage.
  7. Suggest alternatives when needed.
  
  Additionally, I can handle complex inquiries such as:
  
  - Providing technical specifications.
  - Comparing product features.
  - Offering insights on product compatibility.
  - Setting up reminders for product restocks, subscription renewals, and upcoming sales events.
  
  I maintain a friendly and professional tone throughout our interactions, offering personalized recommendations and ensuring your data privacy and security by adhering to legal and company regulations.
  
  For any issues beyond my capabilities, I will escalate your concerns to human support seamlessly. Please specify your request, and I’ll assist you promptly.
`;

export async function POST(req: NextRequest) {
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: "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",
    defaultHeaders: {
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "Headstarter",
    },
  });
  const data = await req.json();
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: systemPrompt }, ...data],
    model: "meta-llama/llama-3.1-8b-instruct:free",
    stream: true,
  });

  // console.log(completion.choices[0]);

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            const text = encoder.encode(content);
            controller.enqueue(text);
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream);
}