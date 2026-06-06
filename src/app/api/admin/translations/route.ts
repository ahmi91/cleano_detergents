import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/admin/auth'
import { addAuditEntry } from '@/lib/admin/data'
import fs from 'fs'
import path from 'path'

const EN_FILE = path.join(process.cwd(), 'src/i18n/en.json')
const AM_FILE = path.join(process.cwd(), 'src/i18n/am.json')

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const en = JSON.parse(fs.readFileSync(EN_FILE, 'utf-8'))
  const am = JSON.parse(fs.readFileSync(AM_FILE, 'utf-8'))
  return NextResponse.json({ en, am })
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { en, am } = await req.json()
  if (en) fs.writeFileSync(EN_FILE, JSON.stringify(en, null, 2))
  if (am) fs.writeFileSync(AM_FILE, JSON.stringify(am, null, 2))

  addAuditEntry({ userId: session.userId, userName: session.name, action: 'update', resource: 'translations', details: 'Updated translation files' })
  return NextResponse.json({ success: true })
}
