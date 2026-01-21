import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

type Role = 'Student' | 'Teacher'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPhone(phone: string) {
  // Loose validation: digits, spaces, +, -, parentheses; 8-20 chars
  return /^[0-9+\-() ]{8,20}$/.test(phone)
}

export function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<Role>('Student')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const errors = useMemo(() => {
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = 'Name is required.'
    if (!email.trim()) next.email = 'Email is required.'
    else if (!isValidEmail(email.trim())) next.email = 'Enter a valid email address.'
    if (!phone.trim()) next.phone = 'Phone is required.'
    else if (!isValidPhone(phone.trim())) next.phone = 'Enter a valid phone number.'
    if (!password) next.password = 'Password is required.'
    else if (password.length < 8) next.password = 'Password must be at least 8 characters.'
    if (!confirmPassword) next.confirmPassword = 'Confirm your password.'
    else if (confirmPassword !== password) next.confirmPassword = 'Passwords do not match.'
    return next
  }, [name, email, phone, password, confirmPassword])

  const canSubmit = Object.keys(errors).length === 0 && !isSubmitting

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched({
      name: true,
      email: true,
      phone: true,
      role: true,
      password: true,
      confirmPassword: true,
    })
    if (!canSubmit) return

    setIsSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 900))
      toast.success('Account created. Please log in.')
      navigate('/login')
    } finally {
      setIsSubmitting(false)
    }
  }

  function fieldError(key: string) {
    if (!touched[key]) return null
    return errors[key] ?? null
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
      <div className="mx-auto flex min-h-full max-w-md flex-col justify-center px-4 py-12">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
            <span className="text-lg font-semibold">L</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Create account</h1>
          <p className="mt-1 text-sm text-slate-600">Library Management System</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                placeholder="Full name"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              {fieldError('name') ? <p className="mt-1 text-xs text-red-600">{fieldError('name')}</p> : null}
            </div>

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
              {fieldError('email') ? <p className="mt-1 text-xs text-red-600">{fieldError('email')}</p> : null}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                placeholder="+1 555 123 4567"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              {fieldError('phone') ? <p className="mt-1 text-xs text-red-600">{fieldError('phone')}</p> : null}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                onBlur={() => setTouched((t) => ({ ...t, role: true }))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
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
                {fieldError('password') ? (
                  <p className="mt-1 text-xs text-red-600">{fieldError('password')}</p>
                ) : null}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Confirm password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                {fieldError('confirmPassword') ? (
                  <p className="mt-1 text-xs text-red-600">{fieldError('confirmPassword')}</p>
                ) : null}
              </div>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Creating…' : 'Create account'}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-700 hover:text-blue-800">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

