'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { KeyRound, Loader2, ShieldCheck, Mail, AlertCircle, RefreshCw } from 'lucide-react'
import { ModeToggle } from '@/components/theme-toggle'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'ready' | 'submitting'>('idle')
  const router = useRouter()

  useEffect(() => {
    // Generate OTP as soon as the login page opens
    fetchOtp()
  }, [])

  const fetchOtp = async () => {
    setStatus('sending')
    try {
      await fetch('/api/admin/login', { method: 'GET' })
      setStatus('ready')
    } catch (err) {
      setStatus('ready')
      setError('Failed to generate OTP. Check server console.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setStatus('submitting')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/service/dashboard')
      } else {
        setError(data.error || 'Invalid OTP')
        setStatus('ready')
        setPassword('')
      }
    } catch (err) {
      setError('Connection error. Please try again.')
      setStatus('ready')
    }
  }

  const handleResend = () => {
    setError('')
    setPassword('')
    fetchOtp()
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-background transition-colors duration-500">
      {/* Theme Toggle in Header */}
      <div className="absolute top-8 right-8 z-50">
        <ModeToggle />
      </div>

      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-float" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full animate-float" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 w-full max-w-sm px-6"
      >
        <div className="p-8 glass rounded-[2.5rem] border border-border/50 shadow-2xl relative overflow-hidden bg-card/10 backdrop-blur-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary"
            >
              <ShieldCheck size={32} />
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Admin Portal</h1>
            <p className="text-muted-foreground text-sm mt-2">
              Secure access for authorized users
            </p>
          </div>

          {/* OTP Status Indicator */}
          <div className="mb-6">
            <AnimatePresence mode="wait">
              {status === 'sending' ? (
                <motion.div
                  key="sending"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2 text-xs py-2 px-3 rounded-full bg-muted/50 text-muted-foreground border border-border/50"
                >
                  <Loader2 size={14} className="animate-spin" />
                  Generating secure password...
                </motion.div>
              ) : (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2 text-xs py-2 px-3 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                >
                  <Mail size={14} />
                  OTP sent to email & console
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <KeyRound size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-muted/30 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-mono tracking-[0.3em] text-lg uppercase"
                placeholder="••••••"
                disabled={status === 'sending' || status === 'submitting'}
                autoFocus
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-destructive text-xs mt-1"
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={status === 'sending' || status === 'submitting' || !password}
              className="w-full py-3 mt-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <button
            onClick={handleResend}
            disabled={status === 'sending' || status === 'submitting'}
            className="w-full mt-6 py-2 text-xs text-muted-foreground hover:text-foreground disabled:text-muted transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} className={status === 'sending' ? 'animate-spin' : ''} />
            Regenerate OTP
          </button>
        </div>

        <p className="mt-8 text-center text-muted-foreground/60 text-xs text-balance">
          Protected by end-to-end security layers
        </p>
      </motion.div>
    </div>
  )
}