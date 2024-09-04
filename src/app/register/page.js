'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, referralCode: ref }),
      })
      if (res.ok) {
        router.push('/login')
      } else {
        const data = await res.json()
        setError(data.message || 'An error occurred during registration')
      }
    } catch (error) {
      setError('An error occurred during registration')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Create an Account</h1>
      <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-secondary text-white py-2 rounded-md hover:bg-secondary/80 transition-colors"
        >
          Register
        </button>
      </form>
      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      {ref && <p className="mt-4 text-green-600 text-center">You were referred by a friend!</p>}
      <p className="mt-4 text-center">
        Already have an account? <Link href="/login" className="text-secondary hover:underline">Login here</Link>
      </p>
    </div>
  )
}