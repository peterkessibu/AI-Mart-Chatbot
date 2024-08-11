import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({ 
  subsets: ["latin"], 
  weight: ["400", "700"] // Specify the weights you want to use
});

export const metadata: Metadata = {
  title: "AI Mart Chatbot", 
  description: "Welcome to Doodo's AI-powered customer service assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className=" bg-[#ceb5f7] items-center justify-between max-h-screen">
          <div className={roboto.className}>
            <header className="text-white items-center sticky top-0 text-center py-12 mb-8 text-base w-1/2 bg-purple-500 mt-8 rounded-full mx-auto z-10">
              Your are using Doodo, an AI powered virtual assistant to help with all your needs!
            </header>
            {children}
          </div>
      </body>
    </html>
  );
}
