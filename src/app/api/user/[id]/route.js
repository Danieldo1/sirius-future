import { NextResponse } from 'next/server'
import { getToken } from "next-auth/jwt"
import connectDB from '@/app/lib/connectDB'
import User from '@/app/models/User'

export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
    try {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
  
      await connectDB()
  
      const user = await User.findById(params.id).select('name email phone surname middleName lessons')
  
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
  
      const userDetails = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        surname: user.surname,
        middleName: user.middleName,
        hasPurchasedLessons: user.lessons && user.lessons.length > 0,
        numberOfLessons: user.lessons ? user.lessons.length : 0
      }
  
      return NextResponse.json(userDetails)
    } catch (error) {
      console.error('Error fetching user details:', error)
      return NextResponse.json({ error: 'An error occurred while fetching user details' }, { status: 500 })
    }
  }