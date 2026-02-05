'use client'

import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

export default function DiscussionSection({ initialTopic, initialReplies = [] }) {
    const { t } = useLanguage()
    const [replies, setReplies] = useState(initialReplies)
    const [newReply, setNewReply] = useState('')

    const handlePostReply = () => {
        if (!newReply.trim()) return

        const reply = {
            id: Date.now(),
            user: 'Guest User', // Placeholder
            content: newReply,
            time: 'Just now'
        }

        setReplies([...replies, reply])
        setNewReply('')
    }

    return (
        <div style={{ marginTop: '2rem' }}>
            <div style={{ background: '#f9f9f9', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
                <h3 style={{ color: '#004d40', marginBottom: '1rem' }}>{initialTopic.title || `${t('community_discussion_title')} #${initialTopic.id}`}</h3>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <div style={{ lineHeight: '1.6', color: '#333' }}>{initialTopic.content}</div>
                </div>
            </div>

            <h3 style={{ color: '#004d40', marginBottom: '1.5rem' }}>{t('community_replies_title')}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                {replies.map((reply) => (
                    <div key={reply.id} style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ width: '2px', background: '#ccc' }}></div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                <strong style={{ color: '#00695c' }}>{reply.user}</strong>
                                <span style={{ fontSize: '0.85rem', color: '#999' }}>• {reply.time}</span>
                            </div>
                            <p style={{ margin: 0, color: '#444' }}>{reply.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '1.5rem' }}>
                <textarea
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder={t('community_reply_placeholder')}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        marginBottom: '1rem',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        minHeight: '100px'
                    }}
                />
                <button
                    onClick={handlePostReply}
                    style={{
                        background: '#00695c',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 2rem',
                        borderRadius: '50px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    {t('community_reply_btn')}
                </button>
            </div>
        </div>
    )
}
