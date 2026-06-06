import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/admin/auth'
import { addAuditEntry } from '@/lib/admin/data'
import fs from 'fs'
import path from 'path'

const MEDIA_DIR = path.join(process.cwd(), 'public/uploads')
const MEDIA_META_FILE = path.join(process.cwd(), 'src/data/admin/media.json')

function ensureDir() {
  if (!fs.existsSync(MEDIA_DIR)) fs.mkdirSync(MEDIA_DIR, { recursive: true })
}

function readMeta(): any[] {
  if (!fs.existsSync(MEDIA_META_FILE)) return []
  try { return JSON.parse(fs.readFileSync(MEDIA_META_FILE, 'utf-8')) } catch { return [] }
}

function writeMeta(data: any[]) {
  const dir = path.dirname(MEDIA_META_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(MEDIA_META_FILE, JSON.stringify(data, null, 2))
}

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(readMeta())
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const contentType = req.headers.get('content-type') || ''

  // Delete action
  if (contentType.includes('application/json')) {
    const body = await req.json()
    if (body._action === 'delete') {
      const meta = readMeta()
      const item = meta.find((m: any) => m.id === body.id)
      if (item) {
        const filePath = path.join(process.cwd(), 'public', item.url)
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
        writeMeta(meta.filter((m: any) => m.id !== body.id))
        addAuditEntry({ userId: session.userId, userName: session.name, action: 'delete', resource: 'media', details: `Deleted: ${item.filename}` })
      }
      return NextResponse.json({ success: true })
    }
  }

  // File upload
  if (contentType.includes('multipart/form-data')) {
    ensureDir()
    const formData = await req.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'general'

    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    const ext = file.name.split('.').pop() || 'jpg'
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()
    const filename = `${Date.now()}-${safeName}`
    const folderPath = path.join(MEDIA_DIR, folder)
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    fs.writeFileSync(path.join(folderPath, filename), buffer)

    const url = `/uploads/${folder}/${filename}`
    const meta = readMeta()
    const newItem = {
      id: `media-${Date.now()}`,
      filename: file.name,
      url,
      folder,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      uploadedBy: session.name,
    }
    writeMeta([newItem, ...meta])
    addAuditEntry({ userId: session.userId, userName: session.name, action: 'create', resource: 'media', details: `Uploaded: ${file.name}` })
    return NextResponse.json({ success: true, item: newItem })
  }

  return NextResponse.json({ error: 'Bad request' }, { status: 400 })
}
