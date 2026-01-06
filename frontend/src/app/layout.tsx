import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LeadGen AI - Turn Any Profile Into Sales Conversations",
  description:
    "AI-powered research assistant for solopreneurs. Analyze LinkedIn profiles, websites, and PDFs to get personalized conversation starters and market insights.",
  keywords: [
    "lead generation",
    "sales research",
    "AI assistant",
    "conversation starters",
    "B2B sales",
    "LinkedIn research",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
