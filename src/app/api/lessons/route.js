import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import connectDB from '@/app/lib/connectDB'
import User from '@/app/models/User'
import { getToken } from 'next-auth/jwt'
// import { getFromCache, setCache } from '@/app/lib/redis'

export async function GET(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // const cacheKey = `lessons:${token.email}`
  
  // get lessons from cache
  // const cachedLessons = await getFromCache(cacheKey)
  // if (cachedLessons) {
  //   return NextResponse.json({ lessons: cachedLessons })
  // }

  // If no cache, get from database
  await connectDB()

  const user = await User.findOne({ email: token.email })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Cache the lessons
  // await setCache(cacheKey, user.lessons, 3600) 

  return NextResponse.json({ lessons: user.lessons })
}