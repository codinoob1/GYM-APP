"use client"

import React from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { NavBar } from './NavBar'
import Link from 'next/link'

const Signup = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  async function handleSignup(e) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <NavBar />
        <section className="flex items-center justify-center px-6 py-20">
          <Card className="w-full max-w-md text-center space-y-4 fade-in-up">
            <div className="text-4xl">✅</div>
            <h1 className="text-2xl font-bold text-white">
              CHECK YOUR<span className="text-[#c4f135]"> INBOX.</span>
            </h1>
            <p className="text-[#8b8d98] text-sm">
              We&apos;ve sent a confirmation link to{' '}
              <span className="text-white">{email}</span>
            </p>
            <Link href="/login">
              <Button variant="primary" className="mt-4">Back to Login</Button>
            </Link>
          </Card>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavBar />
      <section className="flex items-center justify-center px-6 py-12 sm:py-20">
        <div className="relative w-full max-w-md mx-auto">
          {/* Neon glow backdrop */}
          <div className="absolute -inset-4 bg-[#c4f135] rounded-3xl blur-3xl opacity-15 glow-pulse" />

          <Card className="relative fade-in-up">
            <form onSubmit={handleSignup} className="flex flex-col gap-5 sm:gap-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  CREATE YOUR<span className="text-[#c4f135]"> ACCOUNT.</span>
                </h1>
                <p className="text-[#8b8d98] text-xs sm:text-sm">
                  Start tracking smarter today.
                </p>
              </div>

              {error && (
                <div className="bg-red-900/30 border border-red-500/50 text-red-400 text-sm rounded-lg px-4 py-3 text-center">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="font-mono text-xs uppercase tracking-wider text-[#8b8d98]">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#1a1b23] border border-[#2a2d37] rounded-lg px-4 py-3 text-white placeholder-[#8b8d98]/50 focus:outline-none focus:border-[#c4f135] transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="font-mono text-xs uppercase tracking-wider text-[#8b8d98]">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-[#1a1b23] border border-[#2a2d37] rounded-lg px-4 py-3 text-white placeholder-[#8b8d98]/50 focus:outline-none focus:border-[#c4f135] transition-colors"
                  placeholder="At least 6 characters"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm-password" className="font-mono text-xs uppercase tracking-wider text-[#8b8d98]">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-[#1a1b23] border border-[#2a2d37] rounded-lg px-4 py-3 text-white placeholder-[#8b8d98]/50 focus:outline-none focus:border-[#c4f135] transition-colors"
                  placeholder="Re-enter your password"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center disabled:opacity-50 disabled:pointer-events-none"
                disabled={loading}
                arrow
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>

              <p className="text-center text-[#8b8d98] text-xs sm:text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-[#c4f135] hover:underline font-medium">
                  Log in
                </Link>
              </p>
            </form>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default Signup
