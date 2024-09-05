'use client'

import { useSession } from "next-auth/react"
import Link from 'next/link'
import ReferralLink from '../components/ReferralLink'
import Statistics from '../components/Statistics'
import { Loader2 } from "lucide-react"
import Image from "next/image"

export default function Home() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className=" flex items-center justify-center mx-auto w-full h-full pt-20"><Loader2 className="animate-spin" /></div>
  }

  if (!session) {
    return (
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to the SupaSchool</h1>
        <Image src='/school-pic-boy.png' width={300} height={300} alt="School" className="mx-auto select-none"/>
        <p className="mb-8">Please sign in to access your account.</p>
        <div className="space-x-4">
          <Link href="/login">
            <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/80 transition-colors">Sign In</button>
          </Link>
          <Link href="/register">
            <button className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-secondary/80 transition-colors">Sign Up</button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome, {session.user.name}</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-surface p-6 rounded-lg shadow-md">
          <Statistics />
        </div>
        <div className="bg-surface p-6 rounded-lg shadow-md">
          <ReferralLink />
        </div>
      </div>
      <div className="mt-8 text-center">
        <Link href="/api/auth/signout">
          <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors">Sign Out</button>
        </Link>
      </div>
    </div>
  )
}