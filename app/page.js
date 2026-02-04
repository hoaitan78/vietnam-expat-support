'use client'

import { useState } from 'react'
import styles from './page.module.css'
import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'
import SearchBar from '../components/SearchBar'

import { QUICK_LINKS } from '../lib/constants'

export default function Home() {
    const { t } = useLanguage()
    const [filter, setFilter] = useState('')

    const quickLinks = QUICK_LINKS.map(link => ({
        ...link,
        title: t(link.titleKey),
        desc: t(link.descKey),
        btn: t(link.btnKey)
    }))

    const filteredLinks = quickLinks.filter(link =>
        link.title.toLowerCase().includes(filter.toLowerCase()) ||
        link.desc.toLowerCase().includes(filter.toLowerCase())
    )

    return (
        <>
            <section className={styles.hero}>
                <div className="container">
                    <h1 className={styles.heroTitle}>{t('hero_title')}</h1>
                    <p className={styles.heroSubtitle}>
                        {t('hero_subtitle')}
                    </p>
                    <SearchBar onSearch={setFilter} />

                    <Link href="/guides" className="btn btn-secondary">
                        {t('hero_cta')}
                    </Link>
                </div>
            </section>

            <section id="services" className={styles.section}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>{t('services_title')}</h2>

                    {filteredLinks.length === 0 && (
                        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>{t('no_results')}</p>
                    )}

                    <div className={styles.grid}>
                        {filteredLinks.map((link, index) => (
                            <div key={index} className={styles.card}>
                                <span className={styles.cardIcon}>{link.icon}</span>
                                <h3 className={styles.cardTitle}>{link.title}</h3>
                                <p className={styles.cardText}>{link.desc}</p>
                                <Link href={link.href} className="btn btn-primary">{link.btn}</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.section} style={{ backgroundColor: 'var(--color-surface)' }}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>{t('community_title')}</h2>
                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>{t('community_school_title')}</h3>
                            <p className={styles.cardText}>{t('community_school_desc')}</p>
                            <Link href="/community/1" className={styles.navLink}>{t('community_read')}</Link>
                        </div>
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>{t('community_license_title')}</h3>
                            <p className={styles.cardText}>{t('community_license_desc')}</p>
                            <Link href="/community/2" className={styles.navLink}>{t('community_read')}</Link>
                        </div>
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>{t('community_market_title')}</h3>
                            <p className={styles.cardText}>{t('community_market_desc')}</p>
                            <Link href="/community/3" className={styles.navLink}>{t('community_read')}</Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
