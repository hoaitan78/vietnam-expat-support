'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '../../../lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '../../../contexts/AuthContext'
import { useLanguage } from '../../../contexts/LanguageContext'

export default function NewTopicPage() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const { currentUser } = useAuth()
    const { t } = useLanguage()

    // Mock Admin Email List
    const ADMIN_EMAILS = ['hoaitan78@gmail.com']
    const isAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title.trim() || !content.trim()) return

        if (!isAdmin) {
            alert(t('community_admin_required') || 'Only admins can post new topics.')
            return
        }

        setIsSubmitting(true)
        try {
            const docRef = await addDoc(collection(db, 'topics'), {
                title,
                content,
                user: currentUser.email,
                userId: currentUser.uid,
                createdAt: serverTimestamp(),
                repliesCount: 0
            })
            router.push(`/community/${docRef.id}`)
        } catch (error) {
            console.error('Error creating topic:', error)
            alert('Failed to post topic. Please try again.')
            setIsSubmitting(false)
        }
    }

    if (!isAdmin) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h2>{t('community_admin_required') || 'Only admins can post new topics'}</h2>
            </div>
        )
    }

    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>{t('community_post_new') || 'Post New Topic'}</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="What's on your mind?"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }}
                        required
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Content
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Provide more details..."
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', minHeight: '200px' }}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        background: '#00695c',
                        color: 'white',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: 'bold',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting ? 0.7 : 1
                    }}
                >
                    {isSubmitting ? 'Posting...' : (t('community_post_new') || 'Post Topic')}
                </button>
            </form>
        </div>
    )
}
