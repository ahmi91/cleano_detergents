export type AdminRole = 'super_admin' | 'manager' | 'translator' | 'inventory_manager' | 'content_editor'

export interface AdminUser {
  id: string
  email: string
  role: AdminRole
  name: string
  created_at: string
  last_login?: string
  is_active: boolean
}

export interface Permission {
  id: string
  name: string
  description: string
}

export interface RolePermission {
  role: AdminRole
  permissions: string[]
}

export interface AuditLog {
  id: string
  user_id: string
  action: string
  resource_type: string
  resource_id: string
  changes?: Record<string, unknown>
  timestamp: string
}

export interface AdminSettings {
  company_name: string
  logo_url: string
  contact_email: string
  contact_phone: string
  whatsapp_number: string
  telegram_username: string
  social_links: {
    facebook?: string
    instagram?: string
    tiktok?: string
  }
  theme_colors?: {
    primary: string
    secondary: string
  }
}

export interface DashboardStats {
  total_products: number
  total_stores: number
  total_inventory_items: number
  total_subscribers: number
  website_visits: number
  popular_products: Array<{ name: string; views: number }>
  popular_searches: Array<{ term: string; count: number }>
  recent_activity: AuditLog[]
}
