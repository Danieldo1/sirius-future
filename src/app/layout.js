"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

import Link from "next/link";
import { GraduationCap, House, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  
  

  const pathname = usePathname();
  const isActive = pathname === "/";
  const isActiveDashboard = pathname === "/dashboard";



  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-text`}>
        <SessionProvider>
          <div className="min-h-screen flex flex-col">
            {/*  */}
            <Header />

            <main className="flex-grow container mx-auto px-6 py-8 pt-16">
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
