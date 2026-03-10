import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';

  const title = isTr ? "Quizyen - PDF'leri İnteraktif Quizlere Dönüştürün" : "Quizyen - Turn PDFs into Interactive Quizzes";
  const description = isTr
    ? "PDF sınavlarınızı ve ders notlarınızı yükleyin, AI destekli geri bildirimlerle anında interaktif quizlere dönüştürün."
    : "Upload your PDF exams and lecture notes, transform them into interactive quizzes instantly with AI-powered feedback.";

  return {
    title,
    description,
    keywords: isTr
      ? ["quiz", "PDF", "YZ", "yapay zeka", "ders çalışma aracı", "eğitim", "öğrenme", "sınav hazırlık", "test çöz"]
      : ["quiz", "PDF", "AI", "artificial intelligence", "study tool", "education", "learning", "exam prep", "take test"],
    openGraph: {
      title,
      description,
      url: "https://quizyen.com",
      siteName: "Quizyen",
      locale: isTr ? "tr_TR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@bilgegulko1",
    }
  };
}

import { Toaster } from "sonner";
import { Providers } from "../providers";

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <meta name="google-adsense-account" content="ca-pub-8863410308164779"></meta>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8863410308164779"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
