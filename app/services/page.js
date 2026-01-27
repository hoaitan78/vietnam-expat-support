'use client'

import { useLanguage } from '../../contexts/LanguageContext'

export default function ServicesPage() {
    const { t } = useLanguage()

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <h1>{t('page_services_title')}</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                {['Housing Agents', 'Visa Agencies', 'Language Schools', 'International Hospitals'].map(service => (
                    <div key={service} style={{ background: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                        <h2>{service}</h2>
                        <p>Find trusted {service.toLowerCase()} here.</p>
                        <button className="btn btn-primary" style={{ marginTop: '1rem' }}>{t('page_services_btn')}</button>
                    </div>
                ))}
            </div>
        </div>
    )
}
