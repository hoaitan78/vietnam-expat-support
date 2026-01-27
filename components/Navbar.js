'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './Navbar.module.css'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'

export default function Navbar() {
    const { t, language, toggleLanguage } = useLanguage()
    const { theme, toggleTheme } = useTheme()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.inner}`}>
                <button className={styles.hamburger} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? '✕' : '☰'}
                </button>

                <Link href="/" className={styles.logo}>
                    VietnamSupport
                </Link>

                <ul className={`${styles.navLinks} ${isMenuOpen ? styles.open : ''}`}>
                    <li><Link href="/" className={styles.link} onClick={() => setIsMenuOpen(false)}>{t('nav_home')}</Link></li>
                    <li><Link href="/guides" className={styles.link} onClick={() => setIsMenuOpen(false)}>{t('nav_guides')}</Link></li>
                    <li><Link href="/services" className={styles.link} onClick={() => setIsMenuOpen(false)}>{t('nav_services')}</Link></li>
                    <li><Link href="/community" className={styles.link} onClick={() => setIsMenuOpen(false)}>{t('nav_community')}</Link></li>
                </ul>

                <div className={styles.controls}>
                    <button
                        onClick={toggleTheme}
                        className="btn"
                        style={{
                            background: 'transparent',
                            fontSize: '1.2rem',
                            padding: '0.5rem',
                            cursor: 'pointer'
                        }}
                        title="Toggle Dark Mode"
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>

                    <button
                        onClick={toggleLanguage}
                        className="btn"
                        style={{
                            background: 'transparent',
                            border: '1px solid var(--color-primary)',
                            color: 'var(--color-primary)',
                            padding: '0.5rem 1rem'
                        }}
                    >
                        {language === 'vi' ? '🇬🇧 EN' : '🇻🇳 VN'}
                    </button>

                    <Link href="/login" className="btn btn-primary">
                        {t('nav_signin')}
                    </Link>
                </div>
            </div>
        </nav>
    )
}
