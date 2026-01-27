'use client'

import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'

const GUIDES = [
    { slug: 'visa', title: 'Vietnam Visa Guide 2024', category: 'Legal' },
    { slug: 'housing', title: 'Renting in Saigon vs Hanoi', category: 'Housing' },
    { slug: 'transportation', title: 'Mastering the Motorbike', category: 'Lifestyle' },
    { slug: 'banking', title: 'Opening a Bank Account', category: 'Finance' },
]

export default function GuidesPage() {
    const { t } = useLanguage()

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <h1>{t('page_guides_title')}</h1>
            <p style={{ marginBottom: '2rem' }}>{t('page_guides_sub')}</p>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {GUIDES.map(guide => (
                    <div key={guide.slug} style={{
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
