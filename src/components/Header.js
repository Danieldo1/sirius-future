'use client'

import { useScrollDirection } from '@/hooks/useScroll';
import Link from 'next/link';
import { GraduationCap, House, LayoutDashboard } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const scrollDirection = useScrollDirection();
  const pathname = usePathname();

  const isActive = pathname === '/';
  const isActiveDashboard = pathname === '/dashboard';

  return (
    <header
      className={`fixed top-0 left-0 right-0 bg-surface shadow-md transition-transform duration-300 z-10 ${
        scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"
      }`}
    >
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
  );
}