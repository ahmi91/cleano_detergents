import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper'
import { SettingsClient } from './SettingsClient'
import { getSettings } from '@/lib/admin/data'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const settings = getSettings()
  return (
    <AdminPageWrapper requiredResource="settings">
      <SettingsClient initialSettings={settings} />
    </AdminPageWrapper>
  )
}
