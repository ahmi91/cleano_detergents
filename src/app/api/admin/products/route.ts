import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/admin/auth'
import { addAuditEntry } from '@/lib/admin/data'
import fs from 'fs'
import path from 'path'

const PRODUCTS_FILE = path.join(process.cwd(), 'src/data/products.json')

function readProducts() {
  return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'))
}

function writeProducts(data: any[]) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2))
}

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(readProducts())
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const products = readProducts()

  if (body._action === 'delete') {
    const updated = products.filter((p: any) => p.id !== body.id)
    writeProducts(updated)
    addAuditEntry({ userId: session.userId, userName: session.name, action: 'delete', resource: 'products', details: `Deleted product: ${body.id}` })
    return NextResponse.json({ success: true })
  }

  if (body._action === 'update') {
    const { _action, ...data } = body
    const idx = products.findIndex((p: any) => p.id === data.id)
    if (idx >= 0) {
      products[idx] = { ...products[idx], ...data }
      writeProducts(products)
      addAuditEntry({ userId: session.userId, userName: session.name, action: 'update', resource: 'products', details: `Updated product: ${data.id}` })
    }
    return NextResponse.json({ success: true })
  }

  if (body._action === 'create') {
    const { _action, ...data } = body
    const newProduct = { ...data, id: data.id || `product-${Date.now()}` }
    writeProducts([...products, newProduct])
    addAuditEntry({ userId: session.userId, userName: session.name, action: 'create', resource: 'products', details: `Created product: ${newProduct.id}` })
    return NextResponse.json({ success: true, product: newProduct })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
