import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Head from 'next/head';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuizFlow - Transform PDFs into Interactive Quizzes",
  description: "Upload PDF exams and lecture notes, instantly transform them into interactive quizzes with AI-powered feedback",
  keywords: ["quiz", "PDF", "AI", "study tool", "education", "learning"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <Head>
          <title>QuizFlow - Transform PDFs into Interactive Quizzes</title>
          <meta name="description" content="Upload PDF exams and lecture notes, instantly transform them into interactive quizzes with AI-powered feedback." />
          <meta name="keywords" content="quiz, PDF, AI, study tool, education, learning" />
        </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
