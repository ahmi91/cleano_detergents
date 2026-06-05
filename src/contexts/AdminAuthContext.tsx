'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import type { AdminUser, AdminRole } from '@/types/admin'

interface AdminAuthContextType {
  user: AdminUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  hasPermission: (permission: string) => boolean
  hasRole: (role: AdminRole) => boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/admin/auth/session')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Session check failed:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      setUser(data.user)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    // Super admin has all permissions
    if (user.role === 'super_admin') return true
    // Check permission based on role
    const rolePermissions: Record<AdminRole, string[]> = {
      super_admin: ['*'],
      manager: ['products:read', 'products:write', 'stores:read', 'stores:write', 'inventory:read', 'inventory:write'],
      translator: ['translations:read', 'translations:write'],
      inventory_manager: ['inventory:read', 'inventory:write'],
      content_editor: ['content:read', 'content:write', 'media:read', 'media:write'],
    }
    return rolePermissions[user.role]?.includes(permission) || false
  }

  const hasRole = (role: AdminRole): boolean => {
    if (!user) return false
    return user.role === role
  }

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}
