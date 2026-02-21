import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { LanguageProvider } from '../contexts/LanguageContext'
import { AuthProvider } from '../contexts/AuthContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import FacebookMsg from '../components/FacebookMsg'
import WhatsAppMsg from '../components/WhatsAppMsg'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Vietnam Expat Support',
    description: 'Essential guide for expats living in Vietnam',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Merriweather:wght@400;700&display=swap" rel="stylesheet" />
            </head>
            <body className={inter.className}>
                <AuthProvider>
                    <LanguageProvider>
                        <ThemeProvider>
                            <div className="flex flex-col min-h-screen">
                                <Navbar />
                                <main className="main-content">
                                    {children}
                                </main>
                                <Footer />
                            </div>
                            <WhatsAppMsg />
                            <FacebookMsg />
                        </ThemeProvider>
                    </LanguageProvider>
                </AuthProvider>
            </body>
        </html>
    )
}
