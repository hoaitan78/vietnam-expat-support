'use client'

import { useLanguage } from '../contexts/LanguageContext'

export default function SearchBar({ onSearch }) {
    const { t } = useLanguage()

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto 3rem' }}>
            <input
                type="text"
                placeholder={t('search_placeholder')}
                onChange={(e) => onSearch(e.target.value)}
                style={{
                    width: '100%',
                    padding: '1rem 1.5rem',
                    fontSize: '1.1rem',
                    borderRadius: '50px',
                    border: '1px solid var(--color-primary)',
                    boxShadow: 'var(--shadow-md)',
                    outline: 'none',
                    color: 'black'
                }}
            />
        </div>
    )
}
