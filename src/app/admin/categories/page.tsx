import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper'
import { CategoriesClient } from './CategoriesClient'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const DEFAULTS = [
  { id: 'laundry',      label: { en: 'Laundry',      am: 'ልብስ ማጠቢያ' },    order: 1, icon: '🧺', color: '#3B82F6' },
  { id: 'multipurpose', label: { en: 'Multipurpose',  am: 'ባለብዙ ዓላማ' },   order: 2, icon: '✨', color: '#8B5CF6' },
  { id: 'floor',        label: { en: 'Floor',         am: 'ወለል' },           order: 3, icon: '🧹', color: '#10B981' },
  { id: 'dishes',       label: { en: 'Dishes',        am: 'ምግብ ዕቃ' },       order: 4, icon: '🍽️', color: '#F59E0B' },
  { id: 'baby',         label: { en: 'Baby',          am: 'ሕጻን' },           order: 5, icon: '🍼', color: '#EC4899' },
]

function getCategories() {
  const file = path.join(process.cwd(), 'src/data/admin/categories.json')
  if (!fs.existsSync(file)) return DEFAULTS
  return JSON.parse(fs.readFileSync(file, 'utf-8'))
}

export default async function CategoriesPage() {
  const categories = getCategories()
  return (
    <AdminPageWrapper requiredResource="categories">
      <CategoriesClient initialCategories={categories} />
    </AdminPageWrapper>
  )
}
