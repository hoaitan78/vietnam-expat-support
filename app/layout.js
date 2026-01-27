import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { LanguageProvider } from '../contexts/LanguageContext'
import { ThemeProvider } from '../contexts/ThemeContext'

export const metadata = {
    title: 'Vietnam Expat Support',
    description: 'Your essential guide to living in Vietnam',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Merriweather:wght@400;700&display=swap" rel="stylesheet" />
            </head>
            <body>
                <ThemeProvider>
                    <LanguageProvider>
                        <Navbar />
                        <main>{children}</main>
                        <Footer />
                    </LanguageProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
