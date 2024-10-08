'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Annoyed, DiamondPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function ReferralLink({onNewLink}) {
  const [link, setLink] = useState('')
  const { data: session } = useSession()

  const generateLink = async () => {
    if (!session) {
      console.error('User not authenticated')
      toast.error('You must be logged in to generate a referral link')
      return
    }

    try {
      const res = await fetch('/api/referral/generate')
      const data = await res.json()
      setLink(data.referralLink)
      if (onNewLink) onNewLink()
      toast.success('New referral link generated!')
    } catch (error) {
      console.error('Error generating referral link:', error)
      toast.error('Failed to generate referral link')
    }
  }

  const copyLink = () => {
    if (link) {
      navigator.clipboard.writeText(link)
        .then(() => {
          toast.success('Referral link copied to clipboard!')
        })
        .catch((err) => {
          console.error('Failed to copy: ', err)
          toast.error('Failed to copy link')
        })
    } else {
      toast.error('No referral link generated yet')
    }
  }
  

  return (
    <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className='flex justify-between flex-col h-full' >
      <h2 className="text-xl font-semibold mb-4">Generate Referral Link</h2>
      {!link && (
        <div className="flex items-center justify-center mt-4 p-8 bg-gray-100 rounded-md mb-2 border-dashed border-2">
          <Annoyed className="w-12 h-12 text-gray-400" />
          </div>
      )}
      {link && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md mb-2 border-dashed border-2">
          <p className="font-medium">Your referral link:</p>
          <p className="text-primary break-all">{link}</p>
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}

            onClick={copyLink}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition-colors mt-4 w-full"
          >
            Copy Link
          </motion.button>
        </div>
      )}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }} 
        onClick={generateLink}
        className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors mb-4 w-full flex items-center justify-center gap-2"
      >
        
        <DiamondPlus />
        Generate Link
      </motion.button>
    </motion.div>
  )
}