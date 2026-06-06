import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper'
import { ContentClient } from './ContentClient'
import { getPageContent } from '@/lib/admin/data'

export const dynamic = 'force-dynamic'

// Default content sections matching the existing website
const DEFAULT_SECTIONS = [
  { id: 'home-hero',           page: 'home',    section: 'Hero Banner',            titleEn: "Ethiopia's Most Trusted Cleaning Brand",       titleAm: 'የኢትዮጵያ ቁጥር 1 የጽዳት ምርት',                bodyEn: 'Premium detergents crafted for Ethiopian homes. Powerful formulas, unbeatable prices.', bodyAm: 'ለኢትዮጵያ ቤቶች የተዘጋጀ ፕሪሚየም ዲተርጀንቶች።', updatedAt: '' },
  { id: 'home-why',            page: 'home',    section: 'Why Choose CLEANO',       titleEn: 'Why Choose CLEANO?',                            titleAm: 'ለምን CLEANO?',                                bodyEn: 'Lab-tested formulas, affordable prices, locally trusted by thousands of Ethiopian families.', bodyAm: 'በሺዎች ኢትዮጵያዊ ቤተሰቦች የተደገፈ።', updatedAt: '' },
  { id: 'home-features',       page: 'home',    section: 'Features Block',          titleEn: 'Premium Quality',                               titleAm: 'ፕሪሚየም ጥራት',                                bodyEn: 'Lab-tested formulas for superior cleaning power', bodyAm: 'ለላቀ ጽዳት ሃይል ላቦራቶሪ-የተፈተነ ቀመሮች', updatedAt: '' },
  { id: 'about-mission',       page: 'about',   section: 'Mission Statement',       titleEn: 'Our Mission',                                   titleAm: 'ተልዕኮአችን',                                   bodyEn: 'To provide Ethiopian households with world-class cleaning products at accessible prices.', bodyAm: 'ለኢትዮጵያ ቤቶች ዓለም ደረጃ ያላቸው የጽዳት ምርቶችን ተደራሽ ዋጋ ለማቅረብ።', updatedAt: '' },
  { id: 'footer-tagline',      page: 'footer',  section: 'Footer Tagline',          titleEn: "Ethiopia's Most Trusted Cleaning Brand",       titleAm: 'የኢትዮጵያ ቁጥር 1 የጽዳት ምርት',                bodyEn: 'Premium detergents crafted for Ethiopian homes.', bodyAm: 'ለኢትዮጵያ ቤቶች የተዘጋጀ ፕሪሚየም ዲተርጀንቶች።', updatedAt: '' },
  { id: 'contact-intro',       page: 'contact', section: 'Contact Page Intro',      titleEn: 'Get In Touch',                                  titleAm: 'ያግኙን',                                       bodyEn: 'We are here to help. Reach out via WhatsApp, Telegram, or visit your nearest branch.', bodyAm: 'ለመርዳት እዚህ ነን። በ WhatsApp፣ Telegram ያግኙን።', updatedAt: '' },
  { id: 'distributor-cta',     page: 'home',    section: 'Distributor CTA',         titleEn: 'Become a Distributor',                          titleAm: 'ስርጭቱ ይሁኑ',                                  bodyEn: 'Join our network of distributors across Ethiopia. Contact us today to learn more.', bodyAm: 'በኢትዮጵያ ስርጭቶቻችን ትስስር ይቀላቀሉ።', updatedAt: '' },
]

export default async function ContentPage() {
  const saved = getPageContent()
  // Merge saved with defaults
  const sections = DEFAULT_SECTIONS.map(def => {
    const saved_sec = saved.find(s => s.id === def.id)
    return saved_sec ? { ...def, ...saved_sec } : def
  })
  return (
    <AdminPageWrapper requiredResource="content">
      <ContentClient sections={sections} />
    </AdminPageWrapper>
  )
}
