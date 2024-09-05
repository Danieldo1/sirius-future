'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

export default function Statistics({refreshTrigger}) {
  const [stats, setStats] = useState(null)
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      fetchStats()
    }
  }, [session, refreshTrigger])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/referral/statistics')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      } else {
        console.error('Failed to fetch statistics')
      }
    } catch (error) {
      console.error('Error fetching referral statistics:', error)
    }
  }

  if (!stats) return <p className="text-center"><Loader2 className="mx-auto animate-spin" /></p>

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Referral Statistics</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-primary/10 p-4 rounded-md">
          <p className="text-sm text-gray-600">Total Referral Links</p>
          <p className="text-2xl font-bold text-primary">{stats.totalReferrals}</p>
        </div>
        <div className="bg-secondary/10 p-4 rounded-md">
          <p className="text-sm text-gray-600">Total Signups</p>
          <p className="text-2xl font-bold text-secondary">{stats.totalSignups}</p>
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">Referral Details</h3>
      <div className="w-500px max-h-40 overflow-y-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Referral Code</th>
              <th className="p-2 text-left">Signups</th>
              <th className="p-2 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {stats?.referralDetails?.map((referral, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{referral.code}</td>
                <td className="p-2">{referral.signups}</td>
                <td className="p-2">{new Date(referral.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  )
}