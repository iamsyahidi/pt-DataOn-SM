import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Guest Registration System',
  description: 'Aplikasi registrasi tamu dengan Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <header className="bg-blue-600 text-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">Guest Registration System</h1>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        
        <footer className="bg-gray-100 py-4 mt-8">
          <div className="container mx-auto px-4 text-center text-gray-600">
            © {new Date().getFullYear()} Guest Registration System
          </div>
        </footer>
      </body>
    </html>
  )
}