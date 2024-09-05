import Register from '@/components/RegistrationForm'
import { Suspense } from 'react'


export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Create an Account</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Register />
      </Suspense>
    </div>
  )
}