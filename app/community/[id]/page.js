'use client'

import { useState, useEffect } from 'react'
import DiscussionSection from '../../../components/DiscussionSection'
import { db } from '../../../lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useLanguage } from '../../../contexts/LanguageContext'

export default function TopicPage({ params }) {
    const { t } = useLanguage()
    const [topic, setTopic] = useState(null)
    const [loading, setLoading] = useState(true)
    const [resolvedId, setResolvedId] = useState(null)

    useEffect(() => {
        const fetchTopic = async () => {
            try {
                // Next.js parameters might be wrapped in a Promise in recent versions
                const resolvedParams = await Promise.resolve(params);
                const topicId = resolvedParams?.id;

                if (topicId) {
                    setResolvedId(topicId);
                }

                if (!topicId) return;

                const isPredefined = ['1', '2', '3'].includes(topicId);
                const docRef = doc(db, 'topics', topicId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setTopic({
                        id: docSnap.id,
                        title: data.title || '',
                        content: data.content || '',
                        user: data.user || '',
                        repliesCount: data.repliesCount || 0,
                        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null
                    });
                } else if (isPredefined) {
                    setTopic({ id: topicId });
                }
            } catch (error) {
                console.error("Error fetching topic:", error);
                const resolvedParams = await Promise.resolve(params);
                if (resolvedParams?.id) {
                    setResolvedId(resolvedParams.id);
                    if (['1', '2', '3'].includes(resolvedParams.id)) {
                        setTopic({ id: resolvedParams.id });
                    }
                }
            } finally {
                setLoading(false)
            }
        }

        fetchTopic()
    }, [params])

    // Instead of completely aborting render, we display the title based on the URL ID
    // for predefined themes ('1', '2', '3'), and only block or show a skeleton for dynamic themes.
    const isPredefined = ['1', '2', '3'].includes(resolvedId)
    const renderTopic = topic || (isPredefined ? { id: resolvedId } : null)

    if (loading && !renderTopic) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
                <div style={{ marginTop: '2rem' }}>
                    <div style={{ background: '#f9f9f9', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', minHeight: '150px', animation: 'pulse 1.5s infinite' }}>
                        <div style={{ height: '24px', background: '#ccc', borderRadius: '4px', width: '60%', marginBottom: '1rem' }}></div>
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', minHeight: '60px' }}>
                            <div style={{ height: '16px', background: '#eee', borderRadius: '4px', width: '90%', marginBottom: '8px' }}></div>
                            <div style={{ height: '16px', background: '#eee', borderRadius: '4px', width: '75%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!loading && !topic && !isPredefined) {
        return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Topic not found</div>
    }

    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
            {resolvedId && <DiscussionSection topicId={resolvedId} initialTopic={renderTopic} />}
        </div>
    )
}
