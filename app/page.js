'use client'

import { useState } from 'react'
import styles from './page.module.css'
import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'
import SearchBar from '../components/SearchBar'

export default function Home() {
    const { t } = useLanguage()
    const [filter, setFilter] = useState('')

    const quickLinks = [
        { title: t('service_visa'), desc: t('service_visa_desc'), btn: t('service_visa_btn'), href: '/guides/visa', icon: '🌏' },
        { title: t('service_housing'), desc: t('service_housing_desc'), btn: t('service_housing_btn'), href: '/services/housing', icon: '🏠' },
        { title: t('service_jobs'), desc: t('service_jobs_desc'), btn: t('service_jobs_btn'), href: '/services/jobs', icon: '💼' },
    ]

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

            <section className={styles.section}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>{t('services_title')}</h2>

                    {filteredLinks.length === 0 && (
                        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No results found.</p>
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
                            <h3 className={styles.cardTitle}>Các trường học quốc tế ở Nha Trang</h3>
                            <p className={styles.cardText}>"Tìm kiếm các trường học quốc tế tốt nhất cho con bạn..."</p>
                            <Link href="/community/1" className={styles.navLink}>{t('community_read')}</Link>
                        </div>
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>Thủ tục đổi bằng lái xe</h3>
                            <p className={styles.cardText}>"Hướng dẫn thủ tục đổi bằng lái xe nước ngoài sang Việt Nam."</p>
                            <Link href="/community/2" className={styles.navLink}>{t('community_read')}</Link>
                        </div>
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>Các chợ, siêu thị tốt quanh bạn</h3>
                            <p className={styles.cardText}>"Danh sách các chợ và siêu thị uy tín, giá tốt gần nơi bạn sống."</p>
                            <Link href="/community/3" className={styles.navLink}>{t('community_read')}</Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
