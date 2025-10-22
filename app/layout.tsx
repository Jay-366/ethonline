import type { Metadata } from "next";
import { Geist, Geist_Mono, Unbounded } from "next/font/google";
import "../styles/globals.css";
import Navbar from "../components/layout/Navbar";
import SmoothScrollWrapper from "../components/SmoothScrollWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "AI Agent Marketplace Interface",
  description: "The Future of AI Agent Collaboration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${unbounded.variable} antialiased`}
        style={{ backgroundColor: '#161823' }}
      >
        <Navbar />
        <SmoothScrollWrapper>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">
              {children}
            </main>
          </div>
        </SmoothScrollWrapper>
      </body>
    </html>
  );
}
