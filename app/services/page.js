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
                    <div key={index} className={styles.card}>
                        <span className={styles.cardIcon}>{service.icon}</span>
                        <h2 className={styles.cardTitle}>{service.title}</h2>
                        <p className={styles.cardText}>{service.desc}</p>
                        <Link href={service.href} className="btn btn-primary">
                            {service.btn}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}
