import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper'
import { AnalyticsClient } from './AnalyticsClient'
import { getAnalytics } from '@/lib/admin/data'
import productsData from '@/data/products.json'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const raw = getAnalytics()

  // Compute aggregates server-side
  const now = Date.now()
  const DAY = 86400000

  // Daily visits last 14 days
  const dailyVisits: { date: string; visits: number; productViews: number; searches: number }[] = []
  for (let i = 13; i >= 0; i--) {
    const dayStart = new Date(now - i * DAY)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(dayStart.getTime() + DAY)
    const dayEvents = raw.filter(e => {
      const t = new Date(e.timestamp).getTime()
      return t >= dayStart.getTime() && t < dayEnd.getTime()
    })
    dailyVisits.push({
      date: dayStart.toLocaleDateString('en-ET', { month: 'short', day: 'numeric' }),
      visits: dayEvents.filter(e => e.type === 'page_view').length,
      productViews: dayEvents.filter(e => e.type === 'product_view').length,
      searches: dayEvents.filter(e => e.type === 'search').length,
    })
  }

  // Top products
  const productCounts: Record<string, number> = {}
  raw.filter(e => e.type === 'product_view').forEach(e => {
    const id = e.data?.productId || 'unknown'
    productCounts[id] = (productCounts[id] || 0) + 1
  })
  const topProducts = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([id, count]) => {
      const product = (productsData as any[]).find(p => p.id === id)
      return { id, name: product?.name?.en || id, count }
    })

  // Top searches
  const searchCounts: Record<string, number> = {}
  raw.filter(e => e.type === 'search').forEach(e => {
    const q = (e.data?.query || '').toLowerCase().trim()
    if (q) searchCounts[q] = (searchCounts[q] || 0) + 1
  })
  const topSearches = Object.entries(searchCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([query, count]) => ({ query, count }))

  // Page breakdown
  const pageCounts: Record<string, number> = {}
  raw.filter(e => e.type === 'page_view').forEach(e => {
    const pg = e.data?.page || 'unknown'
    pageCounts[pg] = (pageCounts[pg] || 0) + 1
  })
  const pageBreakdown = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([page, count]) => ({ page, count }))

  // Totals
  const totalVisits = raw.filter(e => e.type === 'page_view').length
  const totalProductViews = raw.filter(e => e.type === 'product_view').length
  const totalSearches = raw.filter(e => e.type === 'search').length
  const totalOrderClicks = raw.filter(e => e.type === 'order_click').length

  return (
    <AdminPageWrapper requiredResource="analytics">
      <AnalyticsClient
        dailyVisits={dailyVisits}
        topProducts={topProducts}
        topSearches={topSearches}
        pageBreakdown={pageBreakdown}
        totals={{ totalVisits, totalProductViews, totalSearches, totalOrderClicks }}
      />
    </AdminPageWrapper>
  )
}
