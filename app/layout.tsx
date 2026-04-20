import { Marcellus } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const marcellus = Marcellus({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-marcellus',
})

export const metadata = {
  title: 'CIC Submission Portal - University of Makati',
  description: 'Center for Integrated Communications - Submission Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={marcellus.variable}>
      <body className="font-metropolis bg-gray-50">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
