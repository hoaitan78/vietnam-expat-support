'use client'

import { useState, useEffect } from 'react'
import DiscussionSection from '../../../components/DiscussionSection'
import { db } from '../../../lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function TopicPage({ params }) {
    const [topic, setTopic] = useState(null)
    const [loading, setLoading] = useState(true)

    const isPredefined = ['1', '2', '3'].includes(params?.id);

    useEffect(() => {
        const fetchTopic = async () => {
            try {
                const docRef = doc(db, 'topics', params.id);
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
                    setTopic({ id: params.id });
                }
            } catch (error) {
                console.error("Error fetching topic:", error);
                if (isPredefined) {
                    setTopic({ id: params.id });
                }
            } finally {
                setLoading(false)
            }
        }

        fetchTopic()
    }, [params.id, isPredefined])

    if (loading) {
        return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Loading...</div>
    }

    if (!topic) {
        return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Topic not found</div>
    }

    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
            <DiscussionSection topicId={params.id} initialTopic={topic} />
        </div>
    )
}
