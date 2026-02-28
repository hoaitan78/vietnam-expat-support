'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAuth } from '../../contexts/AuthContext'
import { db } from '../../lib/firebase'
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore'

export default function CommunityPage() {
    const { t } = useLanguage()
    const { currentUser } = useAuth()

    // Mock Admin Email List
    const ADMIN_EMAILS = ['hoaitan78@gmail.com']
    const isAdmin = currentUser && currentUser.email && ADMIN_EMAILS.some(email => email.toLowerCase() === currentUser.email.toLowerCase())

    const [topics, setTopics] = useState([])

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const q = query(collection(db, 'topics'), orderBy('createdAt', 'desc'))
                const querySnapshot = await getDocs(q)
                const topicsData = []
                querySnapshot.forEach((doc) => {
                    topicsData.push({ id: doc.id, ...doc.data() })
                })
                setTopics(topicsData)
            } catch (error) {
                console.error("Error fetching topics: ", error)
            }
        }
        fetchTopics()
    }, [])

    const handleDeleteTopic = async (id) => {
        if (window.confirm(t('confirm_delete_topic') || 'Are you sure you want to delete this topic?')) {
            try {
                await deleteDoc(doc(db, 'topics', id))
                setTopics(topics.filter(topic => topic.id !== id))
            } catch (error) {
                console.error("Error deleting topic: ", error)
            }
        }
    }

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>{t('page_community_title')}</h1>
                {isAdmin && (
                    <Link href="/community/new" style={{
                        background: '#00695c',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '20px',
                        textDecoration: 'none',
                        fontWeight: '500'
                    }}>
                        {t('community_post_new') || 'Post New Topic'}
                    </Link>
                )}
            </div>
            <div style={{ marginTop: '2rem' }}>
                {topics.length === 0 ? (
                    <p style={{ fontStyle: 'italic', color: '#666' }}>{t('no_topics_yet') || 'No topics yet. Be the first to start a discussion!'}</p>
                ) : (
                    topics.map(topic => (
                        <div key={topic.id} style={{
                            borderBottom: '1px solid #eee',
                            padding: '1.5rem 0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h3><Link href={`/community/${topic.id}`}>{topic.title}</Link></h3>
                                <p style={{ fontSize: '0.9rem', color: '#666' }}>Posted by {topic.user} • {topic.createdAt?.toDate ? topic.createdAt.toDate().toLocaleString() : 'Just now'}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ background: '#eee', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem' }}>
                                    {topic.repliesCount || 0} replies
                                </span>
                                {isAdmin && (
                                    <button
                                        onClick={() => handleDeleteTopic(topic.id)}
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
                    ))
                )}
            </div>
        </div>
    )
}
