'use client'

import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'

export default function CommunityPage() {
    const { t } = useLanguage()

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <h1>{t('page_community_title')}</h1>
            <div style={{ marginTop: '2rem' }}>
                {[1, 2, 3, 4].map(id => (
                    <div key={id} style={{
                        borderBottom: '1px solid #eee',
                        padding: '1.5rem 0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <h3><Link href={`/community/${id}`}>Discussion Topic Title #{id}</Link></h3>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>Posted by User{id} • 2 hours ago</p>
                        </div>
                        <span style={{ background: '#eee', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem' }}>
                            {id * 5} replies
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
