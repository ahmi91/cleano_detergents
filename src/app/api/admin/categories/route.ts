import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/admin/auth'
import { addAuditEntry } from '@/lib/admin/data'
import fs from 'fs'
import path from 'path'

const FILE = path.join(process.cwd(), 'src/data/admin/categories.json')

const DEFAULTS = [
  { id: 'laundry',      label: { en: 'Laundry',      am: 'ልብስ ማጠቢያ' },    order: 1, icon: '🧺', color: '#3B82F6' },
  { id: 'multipurpose', label: { en: 'Multipurpose',  am: 'ባለብዙ ዓላማ' },   order: 2, icon: '✨', color: '#8B5CF6' },
  { id: 'floor',        label: { en: 'Floor',         am: 'ወለል' },           order: 3, icon: '🧹', color: '#10B981' },
  { id: 'dishes',       label: { en: 'Dishes',        am: 'ምግብ ዕቃ' },       order: 4, icon: '🍽️', color: '#F59E0B' },
  { id: 'baby',         label: { en: 'Baby',          am: 'ሕጻን' },           order: 5, icon: '🍼', color: '#EC4899' },
]

function read() {
  if (!fs.existsSync(FILE)) { fs.writeFileSync(FILE, JSON.stringify(DEFAULTS, null, 2)); return DEFAULTS }
  return JSON.parse(fs.readFileSync(FILE, 'utf-8'))
}
function write(d: any[]) { fs.writeFileSync(FILE, JSON.stringify(d, null, 2)) }

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(read())
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const cats = read()

  if (body._action === 'create') {
    const { _action, ...data } = body
    const newCat = { ...data, id: data.id || `cat-${Date.now()}`, order: cats.length + 1 }
    write([...cats, newCat])
    addAuditEntry({ userId: session.userId, userName: session.name, action: 'create', resource: 'categories', details: `Created category: ${newCat.id}` })
    return NextResponse.json({ success: true, category: newCat })
  }

  if (body._action === 'update') {
    const { _action, ...data } = body
    const idx = cats.findIndex((c: any) => c.id === data.id)
    if (idx >= 0) { cats[idx] = { ...cats[idx], ...data }; write(cats) }
    addAuditEntry({ userId: session.userId, userName: session.name, action: 'update', resource: 'categories', details: `Updated category: ${data.id}` })
    return NextResponse.json({ success: true })
  }

  if (body._action === 'delete') {
    write(cats.filter((c: any) => c.id !== body.id))
    addAuditEntry({ userId: session.userId, userName: session.name, action: 'delete', resource: 'categories', details: `Deleted category: ${body.id}` })
    return NextResponse.json({ success: true })
  }

  if (body._action === 'reorder') {
    const reordered = body.ids.map((id: string, i: number) => {
      const cat = cats.find((c: any) => c.id === id)
      return cat ? { ...cat, order: i + 1 } : null
    }).filter(Boolean)
    write(reordered)
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
