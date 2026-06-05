'use client'

import { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Montserrat, Nunito } from 'next/font/google'
import '@/app/globals.css'
import { AdminAuthProvider } from '@/contexts/AdminAuthContext'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

const display = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
})

const body = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${display.variable} ${body.variable} font-body bg-gray-50 dark:bg-gray-950`}
        suppressHydrationWarning
      >
        <AdminAuthProvider>
          <div className="flex h-screen bg-gray-100">
            {/* Sidebar - hidden on mobile */}
            <div className="hidden lg:flex lg:flex-col lg:w-64 bg-cleano-navy text-white">
              <AdminSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <AdminHeader />
              <main className="flex-1 overflow-auto bg-gray-50">
                <div className="p-4 lg:p-8">{children}</div>
              </main>
            </div>
          </div>
        </AdminAuthProvider>
      </body>
    </html>
  )
}
