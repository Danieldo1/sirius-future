'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result.error) {
        setError('Invalid email or password')
      } else {
        router.push('/')
      }
    } catch (error) {
      setError('An error occurred during login')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
      <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button type="submit" className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/80 transition-colors">Login</button>
      </form>
      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      <p className="mt-4 text-center">Don't have an account? <Link href="/register" className="text-primary hover:underline">Register here</Link></p>
    </div>
  )
}