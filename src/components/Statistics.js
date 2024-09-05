'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { Clipboard, Loader2 } from 'lucide-react'
import { color, motion } from 'framer-motion'

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
    <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    
    >
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
            <tr className="bg-gray-100 ">
              <th className="p-2 text-left">Referral Code</th>
              <th className="p-2 text-left">Signups</th>
              <th className="p-2 text-left">Created At</th>
            </tr>
          </thead>
          <tbody >
            {stats?.referralDetails?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((referral, index) => (
              <tr key={index} className="border-b ">
                <td className="p-2">{referral.code}</td>
                <td className="p-2">{referral.signups}</td>
                <td className="p-2">{new Date(referral.createdAt).toLocaleDateString()}</td>
                <motion.button
                  whileTap={{ scale: 0.9, opacity: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  className="p-1 mt-1.5 bg-slate-200 rounded-full "
                  onClick={() => {
                    navigator.clipboard.writeText(process.env.NEXT_PUBLIC_URL + '/register?ref=' + referral.code)
                      .then(() => {
                        toast.success('Code copied to clipboard!')
                      })
                      .catch((err) => {
                        console.error('Failed to copy: ', err)
                        toast.error('Failed to copy code')
                      })
                  }}
                ><Clipboard className="w-4 h-4 text-gray-400" /></motion.button>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </motion.div>
  )
}