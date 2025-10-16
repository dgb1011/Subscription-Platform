'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from './auth-context'
import { AlertCircle } from 'lucide-react'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error'; text: string } | null>(null)
  
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await signIn(email, password)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      router.push('/dashboard')
    }

    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>
          Sign in to access your personalized recipes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {message && (
            <div className="flex items-center space-x-2 p-3 rounded-md bg-red-50 text-red-700 border border-red-200">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 space-y-2 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              onClick={() => router.push('/signup')}
              className="text-primary hover:underline"
            >
              Sign up
            </button>
          </p>
          <p className="text-sm text-muted-foreground">
            Forgot your password?{' '}
            <button
              onClick={() => router.push('/forgot-password')}
              className="text-primary hover:underline"
            >
              Reset it
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
