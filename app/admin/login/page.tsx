import LoginForm from './LoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - Area Riservata',
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md p-8 bg-surface-container-lowest border border-outline-variant rounded">
        <h1 className="text-[24px] font-semibold text-primary mb-6 text-center">Area Riservata</h1>
        <LoginForm />
      </div>
    </div>
  )
}
