'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'

export default function DiscussionSection({ initialTopic, initialReplies = [] }) {
    const { t } = useLanguage()
    const { currentUser } = useAuth()
    const [replies, setReplies] = useState(initialReplies)
    const [newReply, setNewReply] = useState('')

    // Mock Admin Email List - In a real app, this should be handled by backend roles/claims
    const ADMIN_EMAILS = ['admin@example.com', currentUser?.email] // Temporarily added current user for testing

    const isAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email)

    const handlePostReply = () => {
        if (!newReply.trim()) return

        const reply = {
            id: Date.now(),
            user: currentUser?.email || 'Anonymous',
            content: newReply,
            time: 'Just now',
            status: isAdmin ? 'approved' : 'pending' // Admins auto-approve their own posts
        }

        setReplies([...replies, reply])
        setNewReply('')
    }

    const handleDeleteReply = (replyId) => {
        if (window.confirm(t('confirm_delete_reply') || 'Are you sure you want to delete this reply?')) {
            setReplies(replies.filter(r => r.id !== replyId))
        }
    }

    const handleUpdateStatus = (replyId, newStatus) => {
        setReplies(replies.map(r =>
            r.id === replyId ? { ...r, status: newStatus } : r
        ))
    }

    // Filter replies for non-admins: only show approved ones
    // For admins: show all
    const visibleReplies = isAdmin
        ? replies
        : replies.filter(r => r.status === 'approved')

    return (
        <div style={{ marginTop: '2rem' }}>
            <div style={{ background: '#f9f9f9', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
                <h3 style={{ color: '#004d40', marginBottom: '1rem' }}>{initialTopic.title || `${t('community_discussion_title')} #${initialTopic.id}`}</h3>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <div style={{ lineHeight: '1.6', color: '#333' }}>{initialTopic.content}</div>
                </div>
            </div>

            <h3 style={{ color: '#004d40', marginBottom: '1.5rem' }}>{t('community_replies_title')} ({visibleReplies.length})</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                {visibleReplies.length === 0 && (
                    <p style={{ fontStyle: 'italic', color: '#777' }}>{t('no_replies_yet') || 'No replies yet. Be the first to share your thoughts!'}</p>
                )}

                {visibleReplies.map((reply) => (
                    <div key={reply.id} style={{
                        display: 'flex',
                        gap: '1rem',
                        opacity: reply.status === 'pending' || reply.status === 'rejected' ? 0.6 : 1,
                        background: reply.status === 'pending' ? '#fffde7' : reply.status === 'rejected' ? '#ffebee' : 'transparent',
                        padding: (reply.status === 'pending' || reply.status === 'rejected') ? '1rem' : '0',
                        borderRadius: '8px'
                    }}>
                        <div style={{ width: '2px', background: '#ccc' }}></div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                                <strong style={{ color: '#00695c' }}>{reply.user}</strong>
                                <span style={{ fontSize: '0.85rem', color: '#999' }}>• {reply.time}</span>
                                {isAdmin && (
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        background: reply.status === 'approved' ? '#e8f5e9' : reply.status === 'rejected' ? '#ffebee' : '#fff8e1',
                                        color: reply.status === 'approved' ? '#2e7d32' : reply.status === 'rejected' ? '#c62828' : '#f9a825',
                                        border: '1px solid',
                                        borderColor: reply.status === 'approved' ? '#a5d6a7' : reply.status === 'rejected' ? '#ef9a9a' : '#ffe082'
                                    }}>
                                        {reply.status ? reply.status.toUpperCase() : 'APPROVED'}
                                    </span>
                                )}
                            </div>
                            <p style={{ margin: 0, color: '#444' }}>{reply.content}</p>

                            {isAdmin && (
                                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                    {reply.status !== 'approved' && (
                                        <button
                                            onClick={() => handleUpdateStatus(reply.id, 'approved')}
                                            style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', cursor: 'pointer', background: '#e8f5e9', border: '1px solid #a5d6a7', color: '#2e7d32', borderRadius: '4px' }}
                                        >
                                            Approve
                                        </button>
                                    )}
                                    {reply.status !== 'rejected' && (
                                        <button
                                            onClick={() => handleUpdateStatus(reply.id, 'rejected')}
                                            style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', cursor: 'pointer', background: '#ffebee', border: '1px solid #ef9a9a', color: '#c62828', borderRadius: '4px' }}
                                        >
                                            Reject
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteReply(reply.id)}
                                        style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', cursor: 'pointer', background: '#fafafa', border: '1px solid #ddd', color: '#555', borderRadius: '4px' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {currentUser ? (
                <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '1.5rem' }}>
                    <div style={{ marginBottom: '1rem', fontStyle: 'italic', color: '#666' }}>
                        Posting as: <strong>{currentUser.email}</strong> {isAdmin && '(Admin)'}
                    </div>
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
            ) : (
                <div style={{
                    background: '#f0f4c3',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    border: '1px solid #dce775'
                }}>
                    <p style={{ marginBottom: '1rem', color: '#555' }}>
                        {t('community_login_required') || 'Please login to participate in the discussion.'}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link href="/login" style={{
                            background: '#00695c',
                            color: 'white',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '20px',
                            textDecoration: 'none',
                            fontWeight: '500'
                        }}>
                            {t('nav_login')}
                        </Link>
                        <Link href="/register" style={{
                            background: 'white',
                            color: '#00695c',
                            border: '1px solid #00695c',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '20px',
                            textDecoration: 'none',
                            fontWeight: '500'
                        }}>
                            {t('nav_register')}
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
