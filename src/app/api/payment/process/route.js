import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/app/lib/connectDB";
import User from "@/app/models/User";
import Referral from "@/app/models/Referral";
import crypto from "crypto";
import { getToken } from "next-auth/jwt";

function deriveKey(key) {
  return crypto
    .createHash("sha256")
    .update(String(key))
    .digest("base64")
    .substr(0, 32);
}

function isCardExpired(month, year) {
    
  const expirationDate = new Date(year, month - 1);
  const today = new Date();
  return expirationDate <= today;
}

export async function POST(request) {
   // Protecting route with JWT token
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { number, expirationMonth, expirationYear, cvv } = await request.json();

  // Test card
  const isTestCard = number === "4111111111111111";

  if (isCardExpired(parseInt(expirationMonth), parseInt(expirationYear))) {
    return NextResponse.json(
      { error: "Card has expired, please enter a future date" },
      { status: 400 }
    );
  }

  if (!isTestCard) {
    return NextResponse.json(
      { error: "Invalid card, please use test card" },
      { status: 400 }
    );
  }

  const algorithm = "aes-256-ctr";
  const secretKey = deriveKey(process.env.ENCRYPTION_KEY);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encryptedNumber = Buffer.concat([
    cipher.update(number),
    cipher.final(),
  ]);

  // Ensure paymentMethods array exists
  if (!user.paymentMethods) {
    user.paymentMethods = [];
  }

  // Save encrypted card
  user.paymentMethods.push({
    last4: number.slice(-4),
    expirationMonth,
    expirationYear,
    encryptedNumber: encryptedNumber.toString("hex"),
    iv: iv.toString("hex"),
  });

  // Ensure lessons array exists
  if (!user.lessons) {
    user.lessons = [];
  }

  // Add 4 lessons for the user
  const newLessons = [
    { title: "Lesson 1", content: "Content for Lesson 1" },
    { title: "Lesson 2", content: "Content for Lesson 2" },
    { title: "Lesson 3", content: "Content for Lesson 3" },
    { title: "Lesson 4", content: "Content for Lesson 4" },
  ];

  user.lessons.push(...newLessons);
  await user.save();

  // Check if this user was referred + add lessons for the referrer
  const referral = await Referral.findOne({
    referredUsers: user._id,
    isSuccessful: false,
  });
  if (referral) {
    const referrer = await User.findById(referral.referrerId);
    if (referrer) {
      if (!referrer.lessons) {
        referrer.lessons = [];
      }
      referrer.lessons.push(...newLessons);
      await referrer.save();
    }
    referral.isSuccessful = true;
    await referral.save();
  }

  return NextResponse.json({
    message: "Payment processed and lessons added successfully",
  });
}
