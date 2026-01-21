/**
 * API service for communicating with the Flask backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

interface ApiResponse<T> {
  data?: T
  error?: string
  status?: number
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include', // Include cookies for session-based auth
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        error: data.error || 'An error occurred',
        status: response.status,
      }
    }

    return { data }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 500,
    }
  }
}

// Auth API
export const authApi = {
  async register(userData: {
    name: string
    email: string
    password: string
    phone: string
    role_id: number
  }) {
    return apiRequest<{ message: string; user_id: number }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },

  async login(credentials: { email: string; password: string }) {
    return apiRequest<{
      message: string
      user: {
        user_id: number
        name: string
        email: string
        role_name: string
        status: string
      }
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },

  async logout() {
    return apiRequest<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    })
  },

  async getCurrentUser() {
    return apiRequest<{
      user: {
        user_id: number
        name: string
        email: string
        role_name: string
        status: string
      }
    }>('/api/auth/me', {
      method: 'GET',
    })
  },
}

// Admin API
export const adminApi = {
  async getStats() {
    return apiRequest<{
      total_students: number
      total_books: number
      books_borrowed: number
      overdue_books: number
      pending_verifications: number
    }>('/api/admin/stats', {
      method: 'GET',
    })
  },

  async getRecentActivities() {
    return apiRequest<
      Array<{
        user_name: string
        action: string
        table_name: string
        timestamp: string
      }>
    >('/api/admin/recent-activities', {
      method: 'GET',
    })
  },

  async getPendingUsers() {
    return apiRequest<
      Array<{
        user_id: number
        name: string
        email: string
        phone: string
        role_name: string
        created_at: string
      }>
    >('/api/admin/pending-users', {
      method: 'GET',
    })
  },

  async verifyUser(userId: number, action: 'approve' | 'reject') {
    return apiRequest<{ message: string }>(`/api/admin/verify-user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ action }),
    })
  },
}
