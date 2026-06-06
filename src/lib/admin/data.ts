import fs from 'fs'
import path from 'path'
import { AdminUser, AdminRole } from './auth'

// Data directory - stores admin data as JSON files
const DATA_DIR = path.join(process.cwd(), 'src/data/admin')

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function readFile<T>(filename: string, defaultValue: T): T {
  ensureDir()
  const filepath = path.join(DATA_DIR, filename)
  try {
    if (!fs.existsSync(filepath)) return defaultValue
    return JSON.parse(fs.readFileSync(filepath, 'utf-8')) as T
  } catch {
    return defaultValue
  }
}

function writeFile<T>(filename: string, data: T): void {
  ensureDir()
  const filepath = path.join(DATA_DIR, filename)
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2))
}

// ---- USERS ----
export interface StoredUser extends AdminUser {
  passwordHash: string
}

const DEFAULT_SUPER_ADMIN: StoredUser = {
  id: 'admin-1',
  email: 'admin@cleano.et',
  name: 'Super Admin',
  role: 'super_admin',
  passwordHash: btoa('cleano@admin2024'), // Simple encoding, prod should use bcrypt
  createdAt: new Date().toISOString(),
}

export function getUsers(): StoredUser[] {
  const users = readFile<StoredUser[]>('users.json', [])

  if (users.length === 0) {
    writeFile('users.json', [DEFAULT_SUPER_ADMIN])
    return [DEFAULT_SUPER_ADMIN]
  }

  return users
}

export function getUserByEmail(email: string): StoredUser | null {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null
}

export function verifyPassword(plain: string, hash: string): boolean {
  return btoa(plain) === hash
}

export function updateUser(
  id: string,
  updates: Partial<StoredUser>
): void {
  const users = getUsers()
  const idx = users.findIndex(u => u.id === id)

  if (idx >= 0) {
    users[idx] = { ...users[idx], ...updates }
    writeFile('users.json', users)
  }
}

export function createUser(user: Omit<StoredUser, 'id' | 'createdAt'>): StoredUser {
  const users = getUsers()
  const newUser: StoredUser = {
    ...user,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  writeFile('users.json', [...users, newUser])
  return newUser
}

export function deleteUser(id: string): void {
  const users = getUsers().filter(u => u.id !== id)
  writeFile('users.json', users)
}

// ---- AUDIT LOG ----
export interface AuditEntry {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  details?: string
  timestamp: string
  ip?: string
}

export function getAuditLog(): AuditEntry[] {
  return readFile<AuditEntry[]>('audit.json', [])
}

export function addAuditEntry(
  entry: Omit<AuditEntry, 'id' | 'timestamp'>
): void {
  const log = getAuditLog()

  const newEntry: AuditEntry = {
    ...entry,
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
  }

  writeFile(
    'audit.json',
    [newEntry, ...log].slice(0, 1000)
  )
}
  // Keep last 1000 entries
  writeFile('audit.json', [newEntry, ...log].slice(0, 1000))
}

// ---- SETTINGS ----
export interface SiteSettings {
  companyName: string
  tagline: string
  whatsappNumber: string
  telegramUsername: string
  email: string
  phone: string
  address: string
  facebookUrl: string
  instagramUrl: string
  tiktokUrl: string
  seoTitle: string
  seoDescription: string
  primaryColor: string
  accentColor: string
  logoUrl: string
  bannerEnabled: boolean
  bannerText: string
  bannerColor: string
  updatedAt: string
}

const DEFAULT_SETTINGS: SiteSettings = {
  companyName: 'CLEANO Detergents',
  tagline: "Ethiopia's Most Trusted Cleaning Brand",
  whatsappNumber: '+251911234567',
  telegramUsername: '@cleano_official',
  email: 'info@cleano.et',
  phone: '+251 91 123 4567',
  address: 'Bole Road, Addis Ababa, Ethiopia',
  facebookUrl: '',
  instagramUrl: '',
  tiktokUrl: 'https://www.tiktok.com/@cleano_official',
  seoTitle: "CLEANO Detergents – Ethiopia's Premium Cleaning Brand",
  seoDescription: 'Premium detergents crafted for Ethiopian homes.',
  primaryColor: '#1B4FD8',
  accentColor: '#F59E0B',
  logoUrl: '',
  bannerEnabled: false,
  bannerText: 'Free delivery on orders over 500 Birr!',
  bannerColor: '#1B4FD8',
  updatedAt: new Date().toISOString(),
}

export function getSettings(): SiteSettings {
  return readFile<SiteSettings>('settings.json', DEFAULT_SETTINGS)
}

export function updateSettings(updates: Partial<SiteSettings>): SiteSettings {
  const current = getSettings()
  const updated = { ...current, ...updates, updatedAt: new Date().toISOString() }
  writeFile('settings.json', updated)
  return updated
}

// ---- INVENTORY ----
export interface InventoryRecord {
  id: string
  productId: string
  size: string
  storeId: string
  quantity: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
  lastUpdated: string
  updatedBy: string
}

export function getInventory(): InventoryRecord[] {
  return readFile<InventoryRecord[]>('inventory.json', [])
}

export function updateInventoryItem(id: string, updates: Partial<InventoryRecord>): void {
  const inv = getInventory()
  const idx = inv.findIndex(i => i.id === id)
  if (idx >= 0) {
    inv[idx] = { ...inv[idx], ...updates, lastUpdated: new Date().toISOString() }
    writeFile('inventory.json', inv)
  } else {
    const newItem: InventoryRecord = {
      id: id || `inv-${Date.now()}`,
      productId: updates.productId || '',
      size: updates.size || '3L',
      storeId: updates.storeId || 'all',
      quantity: updates.quantity || 0,
      status: updates.status || 'in_stock',
      lastUpdated: new Date().toISOString(),
      updatedBy: updates.updatedBy || 'admin',
    }
    writeFile('inventory.json', [...inv, newItem])
  }
}

// ---- CONTENT PAGES ----
export interface PageContent {
  id: string
  page: string
  section: string
  titleEn: string
  titleAm: string
  bodyEn: string
  bodyAm: string
  updatedAt: string
}

export function getPageContent(): PageContent[] {
  return readFile<PageContent[]>('content.json', [])
}

export function updatePageContent(id: string, updates: Partial<PageContent>): void {
  const content = getPageContent()
  const idx = content.findIndex(c => c.id === id)
  const updated = { ...( idx >= 0 ? content[idx] : {}), ...updates, id, updatedAt: new Date().toISOString() }
  if (idx >= 0) content[idx] = updated as PageContent
  else content.push(updated as PageContent)
  writeFile('content.json', content)
}

// ---- ANALYTICS ----
export interface AnalyticsEvent {
  id: string
  type: 'page_view' | 'product_view' | 'search' | 'store_search' | 'order_click'
  data: Record<string, string>
  timestamp: string
}

export function getAnalytics(): AnalyticsEvent[] {
  return readFile<AnalyticsEvent[]>('analytics.json', [])
}

export function trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): void {
  const events = getAnalytics()
  const newEvent: AnalyticsEvent = {
    ...event,
    id: `evt-${Date.now()}`,
    timestamp: new Date().toISOString(),
  }
  writeFile('analytics.json', [newEvent, ...events].slice(0, 5000))
}
