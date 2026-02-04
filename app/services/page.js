'use client'

import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'
import { QUICK_LINKS } from '../../lib/constants'
import styles from './services.module.css'

export default function ServicesPage() {
    const { t } = useLanguage()

    // Map content using translations
    const services = QUICK_LINKS.map(link => ({
        ...link,
        title: t(link.titleKey),
        desc: t(link.descKey),
        btn: t(link.btnKey)
    }))

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{t('services_title')}</h1>

            <div className={styles.grid}>
                {services.map((service, index) => (
                    <div
                        key={index}
                        className={styles.card}
                        style={service.image ? {
                            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${service.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            color: 'white',
                            border: 'none'
                        } : {}}
                    >
                        <span className={styles.cardIcon} style={service.image ? { color: 'white' } : {}}>{service.icon}</span>
                        <h2 className={styles.cardTitle} style={service.image ? { color: 'white' } : {}}>{service.title}</h2>
                        <p className={styles.cardText} style={service.image ? { color: 'rgba(255,255,255,0.9)' } : {}}>{service.desc}</p>
                        <Link
                            href={service.href}
                            className="btn"
                            style={service.image ? {
                                background: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                backdropFilter: 'blur(4px)',
                                border: '1px solid rgba(255,255,255,0.3)'
                            } : {
                                background: 'var(--color-primary)',
                                color: 'white'
                            }}
                        >
                            {service.btn}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}
