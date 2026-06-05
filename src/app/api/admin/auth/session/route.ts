import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * GET /api/admin/auth/session
 * Check current admin session
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'No session' },
        { status: 401 }
      )
    }

    // TODO: Validate token with Supabase
    // For now, return mock user
    return NextResponse.json({
      user: {
        id: '1',
        email: 'admin@cleano.com',
        name: 'Super Admin',
        role: 'super_admin',
        is_active: true,
      },
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json(
      { error: 'Session check failed' },
      { status: 500 }
    )
  }
}
