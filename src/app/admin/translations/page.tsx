import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper'
import { TranslationsClient } from './TranslationsClient'
import enData from '@/i18n/en.json'
import amData from '@/i18n/am.json'

export const dynamic = 'force-dynamic'

export default async function TranslationsPage() {
  return (
    <AdminPageWrapper requiredResource="translations">
      <TranslationsClient initialEn={enData} initialAm={amData} />
    </AdminPageWrapper>
  )
}
