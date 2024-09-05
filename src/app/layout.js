"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { GraduationCap, House, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
            <header className="bg-surface shadow-md">
              <nav className="container mx-auto px-6 py-3 flex items-center">
                <Link href="/" className="flex items-center">
                  <GraduationCap className="size-8 md:size-12 text-primary mr-4" />
                  <h1 className="text-xl md:text-2xl font-bold text-primary text-center truncate">
                    SupaSchool
                  </h1>
                </Link>
                <div className="flex-1 flex justify-end">
                  <div className="flex items-center justify-end ml-4 ">
                    <Link
                      href="/"
                      className={`mr-4 flex p-2 text-primary transition-all rounded-md duration-100 ease-in ${
                        isActive
                          ? "bg-blue-200 text-primary"
                          : "hover:bg-blue-200 hover:text-primary"
                      }`}
                    >
                      <House className="" />
                      <span className="ml-1 hidden md:block">Home</span>
                    </Link>
                    <Link
                      href="/dashboard"
                      className={`mr-4 flex p-2 text-primary transition-all rounded-md duration-100 ease-in ${
                        isActiveDashboard
                          ? "bg-blue-200 text-primary"
                          : "hover:bg-blue-200 hover:text-primary"
                      }`}
                    >
                      <LayoutDashboard className="" />
                      <span className="ml-1 hidden md:block">Dashboard</span>
                    </Link>
                  </div>
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
