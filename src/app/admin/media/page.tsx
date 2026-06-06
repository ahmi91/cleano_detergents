import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper'
import { MediaClient } from './MediaClient'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

function getMedia() {
  const file = path.join(process.cwd(), 'src/data/admin/media.json')
  if (!fs.existsSync(file)) return []
  try { return JSON.parse(fs.readFileSync(file, 'utf-8')) } catch { return [] }
}

export default async function MediaPage() {
  const media = getMedia()
  return (
    <AdminPageWrapper requiredResource="media">
      <MediaClient initialMedia={media} />
    </AdminPageWrapper>
  )
}
