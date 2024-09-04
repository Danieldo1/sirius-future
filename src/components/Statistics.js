'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function Statistics() {
  const [stats, setStats] = useState(null)
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      fetchStats()
    }
  }, [session])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/referral/statistics')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching referral statistics:', error)
    }
  }

  if (!stats) return <p className="text-center">Loading statistics...</p>

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
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Referral Code</th>
              <th className="p-2 text-left">Signups</th>
              <th className="p-2 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {stats.referralDetails.map((referral, index) => (
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