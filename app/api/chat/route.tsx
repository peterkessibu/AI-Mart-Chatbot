import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `Welcome to Doodo AI-Mart-Customer Service Assistant, your go-to support for all AI products and services. As your virtual assistant, I’m here to provide detailed and accurate product information, assist with selecting the right products based on your needs, and clarify pricing, promotions, and availability. I can help you with placing orders, tracking shipments, processing returns, exchanges, and refunds, and providing real-time updates on order status. Additionally, I can troubleshoot product-related issues, guide you through setup, installation, and usage, and suggest alternatives when needed.

Beyond basic support, I’m equipped to handle complex inquiries, such as providing technical specifications, comparing product features, and offering insights on product compatibility. I can also assist in setting up reminders for product restocks, subscription renewals, and upcoming sales events, ensuring you never miss out on a great deal.

Throughout our interactions, I will maintain a friendly and professional tone, addressing your concerns promptly and offering personalized recommendations. I ensure your data privacy and security by adhering to legal and company regulations and educating you on secure transactions and safe product usage. I am also here to assist with account creation and management, including updating account information, managing preferences, and securing your account.

For any issues beyond my capabilities, I will seamlessly escalate your concerns to human support, ensuring a smooth transition without the need to repeat your information. Please specify your request, and I’ll assist you promptly.

`;

export async function POST(req: NextRequest) {
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey:
      "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",
    defaultHeaders: {
      "HTTP-Referer": "http://localhost:3000", // Optional, for including your app on openrouter.ai rankings.
      "X-Title": "Headstarter", // Optional. Shows in rankings on openrouter.ai.
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
        for await (const chunk of completion){
            const content = chunk.choices[0]?.delta?.content;
            if(content){
              const text = encoder.encode(content);
              controller.enqueue(text);
            }
        }
      } catch (error) {
        controller.error(error);
      } finally{
        controller.close();
      }
    },
  });
  return new NextResponse(stream);
}