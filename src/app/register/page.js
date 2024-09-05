import Register from '@/components/RegistrationForm'
import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'


export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto mt-10">
      <Suspense fallback={<div><Loader2 className="mx-auto animate-spin" /></div>}>
        <Register />
      </Suspense>
    </div>
  )
}