import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper'
import { DashboardClient } from './DashboardClient'
import productsData from '@/data/products.json'
import branchesData from '@/data/branches.json'
import { getInventory, getAuditLog, getAnalytics, getSettings } from '@/lib/admin/data'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const inventory = getInventory()
  const auditLog = getAuditLog()
  const analytics = getAnalytics()
  const settings = getSettings()

  // Compute stats
  const totalProducts = productsData.length
  const totalStores = branchesData.length
  const totalInventoryItems = inventory.length

  // Analytics: page views in last 7 days
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const recentViews = analytics.filter(e => new Date(e.timestamp).getTime() > sevenDaysAgo)
  const totalVisits = recentViews.filter(e => e.type === 'page_view').length

  // Most viewed products
  const productViews: Record<string, number> = {}
  analytics.filter(e => e.type === 'product_view').forEach(e => {
    const pid = e.data.productId || 'unknown'
    productViews[pid] = (productViews[pid] || 0) + 1
  })
  const topProducts = Object.entries(productViews)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => {
      const product = (productsData as any[]).find(p => p.id === id)
      return { id, name: product?.name?.en || id, count }
    })

  // Most searched
  const searchCounts: Record<string, number> = {}
  analytics.filter(e => e.type === 'search').forEach(e => {
    const q = e.data.query || ''
    if (q) searchCounts[q] = (searchCounts[q] || 0) + 1
  })
  const topSearches = Object.entries(searchCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([query, count]) => ({ query, count }))

  const recentActivity = auditLog.slice(0, 10)

  return (
    <AdminPageWrapper>
      <DashboardClient
        stats={{
          totalProducts,
          totalStores,
          totalInventoryItems,
          totalVisits,
        }}
        topProducts={topProducts}
        topSearches={topSearches}
        recentActivity={recentActivity}
        settings={settings}
      />
    </AdminPageWrapper>
  )
}
