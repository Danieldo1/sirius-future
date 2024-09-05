import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (req.nextUrl.pathname.startsWith('/api/')) {
    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: 'authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/payment/:path*',
    '/api/referral/:path*',
    '/api/lessons/:path*',
  ]
}