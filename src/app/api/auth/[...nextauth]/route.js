import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter" 
import clientPromise from "@/app/lib/mongodb"
import User from "@/app/models/User"
import bcrypt from "bcryptjs"
import connectDB from "@/app/lib/connectDB"

export const authOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          await connectDB()
  
          if (!credentials?.email || !credentials?.password) {
            return null
          }
  
          const user = await User.findOne({ email: credentials.email })
  
          if (!user) {
            return null
          }
  
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
  
          if (!isPasswordValid) {
            return null
          }
  
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          }
        }
      })
    ],
    session: {
      strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: '/login',
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id
        }
        return token
      },
      async session({ session, token }) {
        if (token) {
          session.user.id = token.id
        }
        return session
      }
    }
  }
  
  const handler = NextAuth(authOptions)
  
  export { handler as GET, handler as POST }