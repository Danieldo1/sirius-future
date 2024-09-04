import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/app/lib/connectDB'
import User from '@/app/models/User'
import Referral from '@/app/models/Referral'
import { isValidPhoneNumber } from 'libphonenumber-js'

export async function POST(request) {
  try {
    const { surname, name, middleName, phone, email, password, referralCode } = await request.json()
    await connectDB()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    if (!isValidPhoneNumber(phone)) {
      return NextResponse.json({ message: 'Invalid phone number' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      surname,
      name,
      middleName,
      phone,
      email,
      password: hashedPassword,
    })

    await newUser.save()

    if (referralCode) {
      const referral = await Referral.findOne({ referralCode })
      if (referral) {
        referral.referredUsers.push(newUser._id)
        await referral.save()
      }
    }

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ message: 'An error occurred during registration' }, { status: 500 })
  }
}