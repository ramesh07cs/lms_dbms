import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '../api'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  })

  const errors = useMemo(() => {
    const next: { email?: string; password?: string } = {}
    if (!email.trim()) next.email = 'Email is required.'
    else if (!isValidEmail(email.trim())) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Password is required.'
    return next
  }, [email, password])

  const canSubmit = Object.keys(errors).length === 0 && !isSubmitting

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched({ email: true, password: true })
    if (!canSubmit) return

    setIsSubmitting(true)
    try {
      const res = await authApi.login({ email, password })

      if (res.error) {
        toast.error(res.error)
        return
      }

      if (res.data) {
        if (rememberMe) {
          localStorage.setItem('lms_remember_email', email.trim())
        } else {
          localStorage.removeItem('lms_remember_email')
        }

        toast.success(`Welcome back, ${res.data.user.name}!`)

        if (res.data.user.role_name === 'Admin') {
          navigate('/admin')
        } else {
          // For now, students/teachers don't have a dashboard
          // navigate('/dashboard') 
          toast('Student/Teacher portal not implemented yet.', { icon: 'ℹ️' })
        }
      }
    } catch (error) {
      toast.error('Login failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
      <div className="mx-auto flex min-h-full max-w-md flex-col justify-center px-4 py-12">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
            <span className="text-lg font-semibold">L</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Sign in</h1>
          <p className="mt-1 text-sm text-slate-600">Library Management System</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                placeholder="you@school.edu"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              {touched.email && errors.email ? (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              ) : null}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                placeholder="••••••••"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              {touched.password && errors.password ? (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              ) : null}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => toast('Password reset is not wired yet.')}
                className="text-sm font-medium text-blue-700 hover:text-blue-800"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-blue-700 hover:text-blue-800">
              Register
            </Link>
          </div>
        </div>


      </div>
    </div>
  )
}

