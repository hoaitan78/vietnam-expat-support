'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './Navbar.module.css'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'

export default function Navbar() {
    const { t, language, toggleLanguage, languages, setLanguage } = useLanguage()
    const { theme, toggleTheme } = useTheme()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.inner}`}>
                <button className={styles.hamburger} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? '✕' : '☰'}
                </button>

                <Link href="/" className={styles.logo}>
                    Nha Trang Support
                </Link>

                <ul className={`${styles.navLinks} ${isMenuOpen ? styles.open : ''}`}>
                    <li><Link href="/" className={styles.link} onClick={() => setIsMenuOpen(false)}>{t('nav_home')}</Link></li>
                    <li><Link href="/guides" className={styles.link} onClick={() => setIsMenuOpen(false)}>{t('nav_guides')}</Link></li>
                    <li><Link href="/services" className={styles.link} onClick={() => setIsMenuOpen(false)}>{t('nav_services')}</Link></li>
                    <li><Link href="/community" className={styles.link} onClick={() => setIsMenuOpen(false)}>{t('nav_community')}</Link></li>
                    <li className={styles.dropdown}>
                        <span className={styles.link} style={{ cursor: 'pointer' }}>{t('nav_contact')} ▾</span>
                        <div className={styles.dropdownContent}>
                            <a href="https://www.facebook.com/?locale=vi_VN" target="_blank" rel="noopener noreferrer" className={styles.dropdownItem}>
                                Facebook
                            </a>
                            <a href="tel:0918257885" className={styles.dropdownItem}>
                                Zalo: 0918257885
                            </a>
                        </div>
                    </li>
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

                    <div className={styles.dropdown} style={{ paddingBottom: 0, marginBottom: 0 }}>
                        <button
                            className="btn"
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--color-primary)',
                                color: 'var(--color-primary)',
                                padding: '0.5rem 1rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                        >
                            {languages.find(l => l.code === language)?.label} ▾
                        </button>
                        {isLangMenuOpen && (
                            <div className={styles.dropdownContent} style={{ display: 'block', minWidth: '150px' }}>
                                {languages.map(lang => (
                                    <div
                                        key={lang.code}
                                        className={styles.dropdownItem}
                                        onClick={() => {
                                            setLanguage(lang.code)
                                            setIsLangMenuOpen(false)
                                            setIsMenuOpen(false)
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {lang.label} {lang.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link href="/login" className="btn btn-primary">
                        {t('nav_signin')}
                    </Link>
                </div>
            </div>
        </nav>
    )
}
