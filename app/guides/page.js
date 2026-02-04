'use client'

import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'

export default function GuidesPage() {
    const { t } = useLanguage()
    const guides = t('guides_list') || []

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <h1>{t('page_guides_title')}</h1>
            <p style={{ marginBottom: '2rem' }}>{t('page_guides_sub')}</p>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {Array.isArray(guides) && guides.map((guide, index) => (
                    <div key={guide.slug || index} style={{
                        padding: '1.5rem',
                        background: 'white',
                        borderRadius: '8px',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <span style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.5rem',
                            background: 'var(--color-secondary)',
                            color: 'var(--color-primary)',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            marginBottom: '0.5rem'
                        }}>
                            {guide.category}
                        </span>
                        <h3><Link href={`/guides/${guide.slug}`} style={{ color: 'var(--color-primary)' }}>{guide.title}</Link></h3>
                    </div>
                ))}
            </div>
        </div>
    )
}
