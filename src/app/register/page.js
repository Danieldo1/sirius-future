'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

export default function Register() {
  const [formData, setFormData] = useState({
    surname: '',
    name: '',
    middleName: '',
    phone: '',
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

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value })
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
        toast.success('Registration successful!')
        router.push('/login')
      } else {
        const data = await res.json()
        setError(data.message || 'An error occurred during registration')
        toast.error(data.message || 'Registration failed')
      }
    } catch (error) {
      setError('An error occurred during registration')
      toast.error('Registration failed')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Create an Account</h1>
      <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">
            Surname
          </label>
          <input
            id="surname"
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-1">
            Middle Name (optional)
          </label>
          <input
            id="middleName"
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <PhoneInput
            international
            countryCallingCodeEditable={false}
            defaultCountry="RU"
            value={formData.phone}
            onChange={handlePhoneChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
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