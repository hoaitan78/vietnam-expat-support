'use client'

import styles from './Footer.module.css'
import { useLanguage } from '../contexts/LanguageContext'

export default function Footer() {
    const { t } = useLanguage()

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.grid}`}>
                <div className={styles.col}>
                    <h3>VietnamSupport</h3>
                    <p>{t('footer_desc')}</p>
                </div>
                <div className={styles.col}>
                    <h3>{t('footer_quicklinks')}</h3>
                    <ul>
                        <li><a href="/guides">{t('nav_guides')}</a></li>
                        <li><a href="/services">{t('nav_services')}</a></li>
                        <li><a href="/community">{t('nav_community')}</a></li>
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
                © {new Date().getFullYear()} Vietnam Expat Support. All rights reserved.
            </div>
        </footer>
    )
}
