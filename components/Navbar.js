'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './Navbar.module.css'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
    const { t, language, toggleLanguage, languages, setLanguage } = useLanguage()
    const { theme, toggleTheme } = useTheme()
    const { currentUser, logout, googleLogin } = useAuth()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
    const [showLoginModal, setShowLoginModal] = useState(false)

    const handleAdminLogin = async () => {
        try {
            await googleLogin()
            setShowLoginModal(false)
        } catch (error) {
            console.error("Login failed", error)
            alert('Login failed: ' + error.message) // Show exact error to the user
        }
    }

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
                        title={t('toggle_theme')}
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

                    {/* Admin Login/Logout */}
                    {currentUser ? (
                        <div className={styles.dropdown} style={{ paddingBottom: 0, marginBottom: 0 }}>
                            <button
                                className="btn btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                👤 {currentUser.email?.split('@')[0]}
                            </button>
                            <div className={styles.dropdownContent}>
                                <div className={styles.dropdownItem} onClick={() => logout()} style={{ cursor: 'pointer' }}>
                                    {t('auth_logout')}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button
                            className="btn"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'transparent', // Make it invisible
                                cursor: 'default' // Don't show pointer
                            }}
                            onDoubleClick={() => setShowLoginModal(true)} // Double click blank space to show login
                            title="Admin Access"
                        >
                            .
                        </button>
                    )}
                </div>
            </div>

            {/* Hidden Admin Login Modal */}
            {showLoginModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', minWidth: '300px', textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '1.5rem', color: 'black' }}>Admin Access</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button
                                onClick={handleAdminLogin}
                                style={{
                                    padding: '0.75rem 1rem',
                                    background: '#db4437', // Google Red
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '1rem'
                                }}
                            >
                                Login with Google
                            </button>
                            <button
                                onClick={() => setShowLoginModal(false)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: '#ccc',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    color: '#333'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
