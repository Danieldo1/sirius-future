import { NextResponse } from 'next/server'
import { getToken } from "next-auth/jwt"
import connectDB from '@/app/lib/connectDB'
import User from '@/app/models/User'

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

    const paymentMethod = user.paymentMethods && user.paymentMethods.length > 0
      ? {
          last4: user.paymentMethods[0].last4,
          expirationMonth: user.paymentMethods[0].expirationMonth,
          expirationYear: user.paymentMethods[0].expirationYear,
        }
      : null

    return NextResponse.json({ paymentMethod })
  } catch (error) {
    console.error('Error fetching payment method:', error)
    return NextResponse.json({ error: 'An error occurred while fetching the payment method' }, { status: 500 })
  }
}