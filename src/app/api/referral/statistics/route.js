import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import connectDB from '@/app/lib/connectDB'
import Referral from '@/app/models/Referral'
import { getToken } from 'next-auth/jwt'
// import { getFromCache, setCache } from '@/app/lib/redis'


export async function GET(request) {
  try {
    // Protecting route with JWT token
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }


    await connectDB()

    const referrals = await Referral.find({ referrerId: token.sub })

    const totalReferrals = referrals.length
    const totalSignups = referrals.reduce((sum, referral) => sum + referral.referredUsers.length, 0)

    const referralDetails = referrals.map(referral => ({
      code: referral.referralCode,
      signups: referral.referredUsers.length,
      createdAt: referral.createdAt
    }))

    const stats = {
      totalReferrals,
      totalSignups,
      referralDetails
    }

    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching referral statistics:', error)
    return NextResponse.json({ error: 'An error occurred while fetching statistics' }, { status: 500 })
  }
}