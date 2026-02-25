'use client'

import { useLanguage } from '../../contexts/LanguageContext'

export default function LegalPage() {
    const { t } = useLanguage()

    return (
        <div className="container" style={{ padding: '6rem 1rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: 'bold' }}>{t('legal_title')}</h1>

            <p style={{ marginBottom: '2rem' }} dangerouslySetInnerHTML={{ __html: t('legal_operated_by') }} />

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem' }}>{t('legal_sec1_title')}</h2>
            <p style={{ marginBottom: '1rem' }}>{t('legal_sec1_desc')}</p>
            <p style={{ marginBottom: '0.5rem' }}>{t('legal_sec1_sub')}</p>
            <ul style={{ listStyleType: 'disc', marginLeft: '2rem', marginBottom: '1rem' }}>
                {Array.isArray(t('legal_sec1_list')) && t('legal_sec1_list').map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            <p>{t('legal_sec1_foot')}</p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem' }}>{t('legal_sec2_title')}</h2>
            <p style={{ marginBottom: '0.5rem' }}>{t('legal_sec2_desc')}</p>
            <ul style={{ listStyleType: 'disc', marginLeft: '2rem', marginBottom: '1rem' }}>
                {Array.isArray(t('legal_sec2_list')) && t('legal_sec2_list').map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            <p>{t('legal_sec2_foot')}</p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem' }}>{t('legal_sec3_title')}</h2>
            <p style={{ marginBottom: '0.5rem' }}>{t('legal_sec3_desc')}</p>
            <ul style={{ listStyleType: 'disc', marginLeft: '2rem', marginBottom: '1rem' }}>
                {Array.isArray(t('legal_sec3_list')) && t('legal_sec3_list').map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem' }}>{t('legal_sec4_title')}</h2>
            <p>{t('legal_sec4_desc')}</p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem' }}>{t('legal_sec5_title')}</h2>
            <p>{t('legal_sec5_desc')}</p>
        </div>
    )
}
