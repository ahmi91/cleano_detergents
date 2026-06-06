import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/admin/auth'
import { addAuditEntry } from '@/lib/admin/data'
import fs from 'fs'
import path from 'path'

const BRANCHES_FILE = path.join(process.cwd(), 'src/data/branches.json')

function readBranches() {
  return JSON.parse(fs.readFileSync(BRANCHES_FILE, 'utf-8'))
}

function writeBranches(data: any[]) {
  fs.writeFileSync(BRANCHES_FILE, JSON.stringify(data, null, 2))
}

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(readBranches())
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const branches = readBranches()

  if (body._action === 'delete') {
    writeBranches(branches.filter((b: any) => b.id !== body.id))
    addAuditEntry({ userId: session.userId, userName: session.name, action: 'delete', resource: 'stores', details: `Deleted store: ${body.id}` })
    return NextResponse.json({ success: true })
  }

  if (body._action === 'update') {
    const { _action, ...data } = body
    const idx = branches.findIndex((b: any) => b.id === data.id)
    if (idx >= 0) { branches[idx] = { ...branches[idx], ...data }; writeBranches(branches) }
    addAuditEntry({ userId: session.userId, userName: session.name, action: 'update', resource: 'stores', details: `Updated store: ${data.id}` })
    return NextResponse.json({ success: true })
  }

  if (body._action === 'create') {
    const { _action, ...data } = body
    const newBranch = { ...data, id: data.id || `branch-${Date.now()}` }
    writeBranches([...branches, newBranch])
    addAuditEntry({ userId: session.userId, userName: session.name, action: 'create', resource: 'stores', details: `Created store: ${newBranch.id}` })
    return NextResponse.json({ success: true, branch: newBranch })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
