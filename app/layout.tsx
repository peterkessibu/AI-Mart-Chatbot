import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"], // Specify the weights you want to use
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
      <body className=" bg-[#ceb5f7] items-center justify-between max-h-screen mx-auto">
        <div className={roboto.className}>
          <header className="text-white text-center py-4 md:py-6 lg:py-8 mb-4 md:mb-6 lg:mb-8 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl w-full md:w-3/4 lg:w-1/2 bg-purple-500 mt-4 md:mt-6 lg:mt-8 mx-auto z-10">
            You are using Doodo, an AI-powered virtual assistant to help with
            all your needs!
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
