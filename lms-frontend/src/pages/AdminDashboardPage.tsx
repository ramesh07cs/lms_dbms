import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { adminApi, authApi } from '../api'

type NavKey = 'dashboard' | 'verify' | 'books' | 'audit' | 'fines'

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

interface Stats {
  total_students: number
  total_books: number
  books_borrowed: number
  overdue_books: number
  pending_verifications: number
}

interface Activity {
  user_name: string
  action: string
  table_name: string
  timestamp: string
}

export function AdminDashboardPage() {
  const navigate = useNavigate()
  const [active, setActive] = useState<NavKey>('dashboard')
  const [profileOpen, setProfileOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    total_students: 0,
    total_books: 0,
    books_borrowed: 0,
    overdue_books: 0,
    pending_verifications: 0,
  })
  const [activity, setActivity] = useState<Activity[]>([])

  // Fetch dashboard data from backend
  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true)
      try {
        // Fetch stats
        const statsResponse = await adminApi.getStats()
        if (statsResponse.error) {
          toast.error(statsResponse.error || 'Failed to load statistics')
        } else if (statsResponse.data) {
          setStats(statsResponse.data)
        }

        // Fetch recent activities
        const activitiesResponse = await adminApi.getRecentActivities()
        if (activitiesResponse.error) {
          toast.error(activitiesResponse.error || 'Failed to load recent activities')
        } else if (activitiesResponse.data) {
          setActivity(activitiesResponse.data)
        }
      } catch (error) {
        toast.error('Failed to load dashboard data')
        console.error('Dashboard fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statsDisplay = [
    { label: 'Total Students', value: stats.total_students },
    { label: 'Total Books', value: stats.total_books },
    { label: 'Books Borrowed', value: stats.books_borrowed },
    { label: 'Overdue Books', value: stats.overdue_books },
    { label: 'Pending Verifications', value: stats.pending_verifications },
  ]

  function formatTimestamp(timestamp: string) {
    try {
      const date = new Date(timestamp)
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return timestamp
    }
  }

  async function onLogout() {
    try {
      await authApi.logout()
      toast.success('Logged out.')
      navigate('/login')
    } catch (error) {
      toast.error('Logout failed')
      navigate('/login')
    }
  }

  return (
    <div className="min-h-full bg-slate-50">
      <div className="flex min-h-full">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:block">
          <div className="flex items-center gap-2 px-5 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <span className="text-sm font-semibold">L</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-900">Library</div>
              <div className="text-xs text-slate-500">Admin Console</div>
            </div>
          </div>

          <nav className="px-3 pb-4">
            {(
              [
                { key: 'dashboard', label: 'Dashboard' },
                { key: 'verify', label: 'Verify Users' },
                { key: 'books', label: 'Manage Books' },
                { key: 'audit', label: 'Audit Logs' },
                { key: 'fines', label: 'Fine Management' },
              ] as const
            ).map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActive(item.key)
                  toast(`Opened: ${item.label}`)
                }}
                className={cx(
                  'mb-1 w-full rounded-xl px-3 py-2 text-left text-sm transition',
                  active === item.key
                    ? 'bg-blue-50 text-blue-800 ring-1 ring-inset ring-blue-100'
                    : 'text-slate-700 hover:bg-slate-50',
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-3 md:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm md:hidden">
                  <span className="text-sm font-semibold">L</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Library Management System</div>
                  <div className="text-xs text-slate-500">Admin Dashboard</div>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <span className="hidden sm:inline">Admin</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                    A
                  </span>
                </button>

                {profileOpen ? (
                  <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                    <button
                      onClick={() => {
                        setProfileOpen(false)
                        onLogout()
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-sm text-slate-500">Loading dashboard data...</div>
              </div>
            ) : (
              <>
                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {statsDisplay.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="text-xs font-medium text-slate-500">{s.label}</div>
                      <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{s.value}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Quick actions */}
            {!loading && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Quick Actions</div>
                    <div className="text-xs text-slate-500">Common admin tasks</div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      onClick={() => {
                        setActive('verify')
                        toast.success('Opening user verification…')
                      }}
                      className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                      Verify Users
                    </button>
                    <button
                      onClick={() => {
                        setActive('books')
                        toast.success('Opening book creation form…')
                      }}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
                    >
                      Add New Book
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Recent activity */}
            {!loading && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between px-4 py-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Recent Activity</div>
                    <div className="text-xs text-slate-500">Latest 5 system activities</div>
                  </div>
                  <button
                    onClick={() => {
                      setActive('audit')
                      toast('Opening full audit log…')
                    }}
                    className="text-sm font-medium text-blue-700 hover:text-blue-800"
                  >
                    View all
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border-t border-slate-200">
                    <thead className="bg-slate-50">
                      <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Action</th>
                        <th className="px-4 py-3">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {activity.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-4 py-8 text-center text-sm text-slate-500">
                            No recent activity
                          </td>
                        </tr>
                      ) : (
                        activity.map((a, idx) => (
                          <tr key={idx} className="text-sm text-slate-700 hover:bg-slate-50">
                            <td className="px-4 py-3 font-medium text-slate-900">{a.user_name || 'System'}</td>
                            <td className="px-4 py-3">
                              {a.action} ({a.table_name})
                            </td>
                            <td className="px-4 py-3 text-slate-500">{formatTimestamp(a.timestamp)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

