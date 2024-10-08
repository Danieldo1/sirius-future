import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import connectDB from "@/app/lib/connectDB"
import User from "@/app/models/User"
import Referral from "@/app/models/Referral"

export const dynamic = 'force-dynamic'


export async function GET(request) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: token.email })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Find referrals made by this user
    const referrals = await Referral.find({ referrerId: user._id }).populate('referredUsers', '_id name email')

    // Find if this user was referred by someone
    const referredBy = await Referral.findOne({ referredUsers: user._id }).populate('referrerId', '_id name email')

    return NextResponse.json({
      referrals: referrals.map(ref => ({
        code: ref.referralCode,
        referredUsers: ref.referredUsers.map(u => ({ id: u._id.toString(), name: u.name, email: u.email }))
      })),
      referredBy: referredBy ? {
        id: referredBy.referrerId._id.toString(),
        name: referredBy.referrerId.name,
        email: referredBy.referrerId.email
      } : null
    })
  } catch (error) {
    console.error('Error fetching referral info:', error)
    return NextResponse.json({ error: 'An error occurred while fetching referral information' }, { status: 500 })
  }
}