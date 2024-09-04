"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { PlugZap } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-text`}>
        <SessionProvider>
          <div className="min-h-screen flex flex-col">
            <header className="bg-surface shadow-md">
              <nav className="container mx-auto px-6 py-3 flex items-center">
                <PlugZap className="w-12 h-12 text-primary mr-4" />
                <div className="flex-1 flex justify-center">
                  <h1 className="text-2xl font-bold text-primary text-center truncate">
                    Referral System
                  </h1>
                </div>
              </nav>
            </header>
            <main className="flex-grow container mx-auto px-6 py-8">
              {children}
            </main>
            <footer className="bg-surface mt-auto">
              <div className="container mx-auto px-6 py-3 text-center text-sm">
                © 2024 Referral System. All rights reserved.
              </div>
            </footer>
          </div>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
