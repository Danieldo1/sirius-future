import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectDB from '@/app/lib/connectDB'
import User from '@/app/models/User'
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

  const user = await User.findOne({ email: session.user.email })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const referralCode = Math.random().toString(36).substr(2, 8)

  const newReferral = new Referral({
    referrerId: user._id,
    referralCode,
    referredUsers: [], 
  })

  try {
    await newReferral.save()
  } catch (error) {
    console.error('Error saving referral:', error)
    return NextResponse.json({ error: 'Error creating referral' }, { status: 500 })
  }

  const referralLink = `${process.env.NEXTAUTH_URL}/register?ref=${referralCode}`

  return NextResponse.json({ referralLink, referralCode })
}