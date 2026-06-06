import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/admin/auth'
import { getUsers, createUser, deleteUser, updateUser, addAuditEntry } from '@/lib/admin/data'

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session || session.role !== 'super_admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const users = getUsers().map(({ passwordHash, ...rest }) => rest) // strip password
  return NextResponse.json(users)
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session || session.role !== 'super_admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()

  if (body._action === 'create') {
    const { _action, password, ...data } = body
    const newUser = createUser({ ...data, passwordHash: btoa(password) })
    addAuditEntry({ userId: session.userId, userName: session.name, action: 'create', resource: 'users', details: `Created user: ${newUser.email}` })
    return NextResponse.json({ success: true })
  }

  if (body._action === 'update_role') {
    updateUser(body.id, { role: body.role })
    addAuditEntry({ userId: session.userId, userName: session.name, action: 'update', resource: 'users', details: `Changed role of user ${body.id} to ${body.role}` })
    return NextResponse.json({ success: true })
  }

  if (body._action === 'delete') {
    if (body.id === session.userId) return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 })
    deleteUser(body.id)
    addAuditEntry({ userId: session.userId, userName: session.name, action: 'delete', resource: 'users', details: `Deleted user: ${body.id}` })
    return NextResponse.json({ success: true })
  }

  if (body._action === 'reset_password') {
    updateUser(body.id, { passwordHash: btoa(body.newPassword) })
    addAuditEntry({ userId: session.userId, userName: session.name, action: 'update', resource: 'users', details: `Reset password for user: ${body.id}` })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
