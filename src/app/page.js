'use client'

import { useSession } from "next-auth/react"
import Link from 'next/link'
import ReferralLink from '../components/ReferralLink'
import Statistics from '../components/Statistics'
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from 'react'
import ReferralInfo from "@/components/ReferralInfo"
import { motion } from "framer-motion"

export default function Home() {
  const { data: session, status } = useSession()
  
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleNewReferralLink = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  const btnVariants = {
    hidden: { opacity: 0, y: 20,  },
    visible: { opacity: 1, y: 0, transition: { delay: 0.7 }  },
  };

  const paragraphVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.5 } }
  };
  

  if (status === "loading") {
    return <div className=" flex items-center justify-center mx-auto w-full h-full pt-20"><Loader2 className="animate-spin" /></div>
  }

  if (!session) {
    return (
      <div className="text-center bg-white p-6 rounded-lg shadow">
       <motion.h1 
          initial="hidden" 
          animate="visible" 
          variants={headingVariants} 
          transition={{ duration: 0.5 }} 
          className="text-4xl font-bold mb-6 select-none"
        >
          Welcome to the SupaSchool
        </motion.h1>
        <Image src='/school-pic-boy.png' width={300} height={300} alt="School" draggable="false" className="mx-auto select-none"/>
        <motion.p 
          initial="hidden" 
          animate="visible" 
          variants={paragraphVariants} 
          transition={{ duration: 0.5, delay: 0.2 }} 
          className="mb-8 text-gray-600"
        >
          Please sign in to access your account.
        </motion.p>
        <div className="space-x-4">
          <Link href="/login">
            <motion.button 
            initial="hidden" 
            animate="visible"
            variants={btnVariants}
            whileHover={{ scale: 1.1 }}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/80 transition-colors">Sign In</motion.button>
          </Link>
          <Link href="/register">
            <motion.button 
            initial="hidden" 
            animate="visible"
            variants={btnVariants}
            whileHover={{ scale: 1.1 }}
            className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-secondary/80 transition-colors">Sign Up</motion.button>
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
        <ReferralInfo refreshTrigger={refreshTrigger}  />
      </div>
      <div className="mt-8 text-center">
        <Link href="/api/auth/signout">
          <motion.button 
          whileHover={{ scale: 1.1 }}
          className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors">Sign Out</motion.button>
        </Link>
      </div>
    </div>
  )
}