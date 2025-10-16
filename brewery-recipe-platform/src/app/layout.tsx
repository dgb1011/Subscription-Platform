import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/analytics";
import { AuthProvider } from "@/components/auth/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brewery Recipe Platform - AI-Powered Personalized Brewing Recipes",
  description: "Get professionally curated, AI-matched brewery recipes tailored to your equipment, experience level, and preferences. The Netflix of brewing is here.",
  keywords: ["brewing", "recipes", "beer", "homebrew", "brewery", "AI", "personalized"],
  authors: [{ name: "Brewery Recipe Platform" }],
  creator: "Brewery Recipe Platform",
  publisher: "Brewery Recipe Platform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: "Brewery Recipe Platform - AI-Powered Personalized Brewing Recipes",
    description: "Get professionally curated, AI-matched brewery recipes tailored to your equipment, experience level, and preferences.",
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: "Brewery Recipe Platform",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Brewery Recipe Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brewery Recipe Platform - AI-Powered Personalized Brewing Recipes",
    description: "Get professionally curated, AI-matched brewery recipes tailored to your equipment, experience level, and preferences.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
