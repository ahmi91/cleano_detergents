import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper'
import { ProductsClient } from './ProductsClient'
import productsData from '@/data/products.json'
import branchesData from '@/data/branches.json'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  return (
    <AdminPageWrapper requiredResource="products">
      <ProductsClient
        initialProducts={productsData as any}
        branches={branchesData as any}
      />
    </AdminPageWrapper>
  )
}
