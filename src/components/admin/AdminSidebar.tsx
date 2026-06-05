'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Package,
  Store,
  Boxes,
  Languages,
  FileText,
  Image,
  Users,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { useState } from 'react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  requiredPermission?: string
}

const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: 'Products',
    href: '/admin/products',
    icon: <Package className="w-5 h-5" />,
    requiredPermission: 'products:read',
  },
  {
    label: 'Categories',
    href: '/admin/categories',
    icon: <Package className="w-5 h-5" />,
    requiredPermission: 'products:read',
  },
  {
    label: 'Stores',
    href: '/admin/stores',
    icon: <Store className="w-5 h-5" />,
    requiredPermission: 'stores:read',
  },
  {
    label: 'Inventory',
    href: '/admin/inventory',
    icon: <Boxes className="w-5 h-5" />,
    requiredPermission: 'inventory:read',
  },
  {
    label: 'Translations',
    href: '/admin/translations',
    icon: <Languages className="w-5 h-5" />,
    requiredPermission: 'translations:read',
  },
  {
    label: 'Content',
    href: '/admin/content',
    icon: <FileText className="w-5 h-5" />,
    requiredPermission: 'content:read',
  },
  {
    label: 'Media',
    href: '/admin/media',
    icon: <Image className="w-5 h-5" />,
    requiredPermission: 'media:read',
  },
  {
    label: 'Subscribers',
    href: '/admin/subscribers',
    icon: <Users className="w-5 h-5" />,
    requiredPermission: 'content:read',
  },
  {
    label: 'Notifications',
    href: '/admin/notifications',
    icon: <Bell className="w-5 h-5" />,
    requiredPermission: 'content:read',
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: <Settings className="w-5 h-5" />,
    requiredPermission: 'content:read',
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { logout, hasPermission, user } = useAdminAuth()
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)

  const handleLogout = async () => {
    await logout()
  }

  const visibleItems = navigationItems.filter((item) =>
    item.requiredPermission ? hasPermission(item.requiredPermission) : true
  )

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-cleano-sky/20">
        <h1 className="text-2xl font-bold text-white">CLEANO</h1>
        <p className="text-sm text-cleano-light">Administration</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-cleano-blue text-white'
                  : 'text-cleano-light hover:bg-cleano-navy/50'
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-cleano-sky/20 space-y-3">
        {user && (
          <div className="px-4 py-2 bg-cleano-navy/50 rounded-lg">
            <p className="text-xs text-cleano-light">Logged in as</p>
            <p className="text-sm font-semibold text-white truncate">{user.email}</p>
            <p className="text-xs text-cleano-light capitalize">{user.role.replace('_', ' ')}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  )
}
