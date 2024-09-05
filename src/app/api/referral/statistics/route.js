import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import connectDB from '@/app/lib/connectDB'
import Referral from '@/app/models/Referral'
import { getToken } from 'next-auth/jwt'


export async function GET(request) {
// Protecting route wuth JWT token
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  const referrals = await Referral.find({ referrerId: session.user.id })

  const totalReferrals = referrals.length
  const totalSignups = referrals.reduce((sum, referral) => sum + referral.referredUsers.length, 0)

  const referralDetails = referrals.map(referral => ({
    code: referral.referralCode,
    signups: referral.referredUsers.length,
    createdAt: referral.createdAt
  }))

  return NextResponse.json({
    totalReferrals,
    totalSignups,
    referralDetails
  })
}