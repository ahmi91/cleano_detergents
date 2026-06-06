import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper'
import { InventoryClient } from './InventoryClient'
import productsData from '@/data/products.json'
import branchesData from '@/data/branches.json'
import { getInventory } from '@/lib/admin/data'

export const dynamic = 'force-dynamic'

export default async function InventoryPage() {
  const inventory = getInventory()
  return (
    <AdminPageWrapper requiredResource="inventory">
      <InventoryClient
        initialInventory={inventory}
        products={productsData as any}
        branches={branchesData as any}
      />
    </AdminPageWrapper>
  )
}
