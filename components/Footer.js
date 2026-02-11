'use client'

import styles from './Footer.module.css'
import { useLanguage } from '../contexts/LanguageContext'

export default function Footer() {
    const { t } = useLanguage()

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.grid}`}>
                <div className={styles.col}>
                    <h3>Nha Trang Support</h3>
                    <p>{t('footer_desc')}</p>
                </div>
                <div className={styles.col}>
                    <h3>{t('footer_quicklinks')}</h3>
                    <ul>
                        <li><a href="/guides">{t('nav_guides')}</a></li>
                        <li><a href="/services">{t('nav_services')}</a></li>
                        <li><a href="/community">{t('nav_community')}</a></li>
                        <li>
                            <a
                                href="https://www.facebook.com/profile.php?id=61587738368961"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>🔵</span> Facebook Page
                            </a>
                        </li>
                    </ul>
                </div>
                <div className={styles.col}>
                    <h3>{t('footer_legal')}</h3>
                    <ul>
                        <li><a href="/privacy">{t('footer_privacy')}</a></li>
                        <li><a href="/terms">{t('footer_terms')}</a></li>
                    </ul>
                </div>
            </div>
            <div className={styles.copyright}>
                {t('footer_copyright')}
            </div>
        </footer>
    )
}
