import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper'
import { StoresClient } from './StoresClient'
import branchesData from '@/data/branches.json'

export const dynamic = 'force-dynamic'

export default async function StoresPage() {
  return (
    <AdminPageWrapper requiredResource="stores">
      <StoresClient initialBranches={branchesData as any} />
    </AdminPageWrapper>
  )
}
