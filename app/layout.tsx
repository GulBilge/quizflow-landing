import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quizyen - PDF'leri İnteraktif Quizlere Dönüştürün",
  description: "PDF sınavlarınızı ve ders notlarınızı yükleyin, AI destekli geri bildirimlerle anında interaktif quizlere dönüştürün.",
  keywords: ["quiz", "PDF", "YZ", "yapay zeka", "ders çalışma aracı", "eğitim", "öğrenme", "sınav hazırlık", "test çöz"],
  openGraph: {
    title: "Quizyen - PDF'leri İnteraktif Quizlere Dönüştürün",
    description: "PDF sınavlarınızı ve ders notlarınızı yükleyin, AI destekli geri bildirimlerle anında interaktif quizlere dönüştürün.",
    url: "https://quizflow.app", // Replace with actual URL if known, or keep generic for now
    siteName: "Quizyen",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quizyen - PDF'leri İnteraktif Quizlere Dönüştürün",
    description: "Yapay zeka ile PDF notlarınızdan quiz oluşturun.",
    creator: "@bilgegulko1",
  }
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
