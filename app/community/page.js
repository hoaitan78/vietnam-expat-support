'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAuth } from '../../contexts/AuthContext'

export default function CommunityPage() {
    const { t } = useLanguage()
    const { currentUser } = useAuth()

    // Mock Admin Email List
    const ADMIN_EMAILS = ['admin@example.com', 'hoaitan78@gmail.com', currentUser?.email]
    const isAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email)

    const [topics, setTopics] = useState([1, 2, 3, 4])

    const handleDeleteTopic = (id) => {
        if (window.confirm(t('confirm_delete_topic') || 'Are you sure you want to delete this topic?')) {
            setTopics(topics.filter(topicId => topicId !== id))
        }
    }

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <h1>{t('page_community_title')}</h1>
            <div style={{ marginTop: '2rem' }}>
                {topics.map(id => (
                    <div key={id} style={{
                        borderBottom: '1px solid #eee',
                        padding: '1.5rem 0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <h3><Link href={`/community/${id}`}>{`${t('community_discussion_title')} #${id}`}</Link></h3>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>Posted by User{id} • 2 hours ago</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ background: '#eee', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem' }}>
                                {id * 5} replies
                            </span>
                            {isAdmin && (
                                <button
                                    onClick={() => handleDeleteTopic(id)}
                                    style={{
                                        background: '#ffebee',
                                        color: '#c62828',
                                        border: '1px solid #ef9a9a',
                                        borderRadius: '4px',
                                        padding: '0.25rem 0.5rem',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    {t('community_delete_topic') || 'Delete'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
