import Register from '@/components/RegistrationForm'
import { Suspense } from 'react'


export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto mt-10">
      <Suspense fallback={<div>Loading...</div>}>
        <Register />
      </Suspense>
    </div>
  )
}