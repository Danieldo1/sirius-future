'use client'

import { useSession } from "next-auth/react"
import Link from 'next/link'
import ReferralLink from '../components/ReferralLink'
import Statistics from '../components/Statistics'
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from 'react'

export default function Home() {
  const { data: session, status } = useSession()
  const [referralInfo, setReferralInfo] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleNewReferralLink = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  useEffect(() => {
    if (session) {
      fetchReferralInfo()
    }
  }, [session])

  const fetchReferralInfo = async () => {
    try {
      const response = await fetch('/api/referral/info')
      if (response.ok) {
        const data = await response.json()
        setReferralInfo(data)
      }
    } catch (error) {
      console.error('Error fetching referral info:', error)
    }
  }

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
          <Statistics refreshTrigger={refreshTrigger} />
        </div>
        <div className="bg-surface p-6 rounded-lg shadow-md">
          <ReferralLink onNewLink={handleNewReferralLink} />
        </div>
        {referralInfo && (
        <div className="mt-8 bg-surface p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Your Referrals</h2>
          {referralInfo?.referrals.length > 0 ? (
             <div className="w-500px max-h-80 overflow-y-auto">
             <ul className="space-y-4">
               {referralInfo.referrals.map((referral, index) => (
                 <li key={index} className="bg-white p-4 rounded shadow">
                   <p className="font-semibold">Referral Code: {referral.code}</p>
                   <p>Referred Users:</p>
                   <ul className="list-disc list-inside">
                     {referral.referredUsers.map((user, userIndex) => (
                       <li key={userIndex}>{user.name} ({user.email})</li>
                     ))}
                   </ul>
                 </li>
               ))}
             </ul>
           </div>
          ) : (
            <p>You haven't referred anyone yet.</p>
          )}

          {referralInfo?.referredBy && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">You Were Referred By</h2>
              <p>{referralInfo.referredBy.name} ({referralInfo.referredBy.email})</p>
            </div>
          )}
        </div>
      )}
      </div>
      <div className="mt-8 text-center">
        <Link href="/api/auth/signout">
          <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors">Sign Out</button>
        </Link>
      </div>
    </div>
  )
}