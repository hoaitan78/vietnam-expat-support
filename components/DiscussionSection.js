'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../lib/firebase'
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, setDoc, serverTimestamp, query, orderBy, increment } from 'firebase/firestore'

export default function DiscussionSection({ topicId, initialTopic }) {
    const { t } = useLanguage()
    const { currentUser } = useAuth()
    const [replies, setReplies] = useState([])
    const [newReply, setNewReply] = useState('')

    // Mock Admin Email List - In a real app, this should be handled by backend roles/claims
    const ADMIN_EMAILS = ['hoaitan78@gmail.com'] // Only the specified email has admin rights

    const isAdmin = currentUser && currentUser.email && ADMIN_EMAILS.some(email => email.toLowerCase() === currentUser.email.toLowerCase())

    useEffect(() => {
        if (!topicId) return;
        const fetchReplies = async () => {
            try {
                const q = query(collection(db, 'topics', topicId, 'replies'), orderBy('createdAt', 'asc'))
                const querySnapshot = await getDocs(q)
                const repliesData = []
                querySnapshot.forEach((doc) => {
                    repliesData.push({ id: doc.id, ...doc.data() })
                })
                setReplies(repliesData)
            } catch (error) {
                console.error("Error fetching replies:", error)
            }
        }
        fetchReplies()
    }, [topicId])

    const handlePostReply = async () => {
        if (!newReply.trim() || !currentUser) return

        try {
            const isApproved = isAdmin;
            const replyData = {
                user: currentUser.email,
                userId: currentUser.uid,
                content: newReply,
                createdAt: serverTimestamp(),
                status: isApproved ? 'approved' : 'pending' // Admins auto-approve their own posts
            }

            const docRef = await addDoc(collection(db, 'topics', topicId, 'replies'), replyData)

            if (isApproved) {
                // Update replies count if approved
                // Make sure we create the document first if it's a predefined one
                const topicRef = doc(db, 'topics', topicId);
                await setDoc(topicRef, {
                    repliesCount: increment(1)
                }, { merge: true })
            } else {
                alert(t('reply_pending_approval') || 'Your reply has been submitted and is awaiting admin approval.')
            }

            // Optimistically update UI
            setReplies([...replies, { ...replyData, id: docRef.id, createdAt: new Date() }])
            setNewReply('')
        } catch (error) {
            console.error("Error posting reply:", error)
            alert("Failed to post reply. Please try again.")
        }
    }

    const handleDeleteReply = async (replyId, currentStatus) => {
        if (window.confirm(t('confirm_delete_reply') || 'Are you sure you want to delete this reply?')) {
            try {
                await deleteDoc(doc(db, 'topics', topicId, 'replies', replyId))

                // Decrement replies count only if it was approved
                if (currentStatus === 'approved') {
                    const topicRef = doc(db, 'topics', topicId);
                    await setDoc(topicRef, {
                        repliesCount: increment(-1)
                    }, { merge: true })
                }

                setReplies(replies.filter(r => r.id !== replyId))
            } catch (error) {
                console.error("Error deleting reply:", error)
            }
        }
    }

    const handleUpdateStatus = async (replyId, newStatus, currentStatus) => {
        try {
            await updateDoc(doc(db, 'topics', topicId, 'replies', replyId), {
                status: newStatus
            })

            // Adjust replies count if status changes to or from approved
            const topicRef = doc(db, 'topics', topicId);
            if (newStatus === 'approved' && currentStatus !== 'approved') {
                await setDoc(topicRef, {
                    repliesCount: increment(1)
                }, { merge: true })
            } else if (newStatus !== 'approved' && currentStatus === 'approved') {
                await setDoc(topicRef, {
                    repliesCount: increment(-1)
                }, { merge: true })
            }

            setReplies(replies.map(r =>
                r.id === replyId ? { ...r, status: newStatus } : r
            ))
        } catch (error) {
            console.error("Error updating status:", error)
        }
    }

    // Filter replies for non-admins: only show approved ones and their own
    // For admins: show all
    const visibleReplies = isAdmin
        ? replies
        : replies.filter(r => r.status === 'approved' || (currentUser && r.userId === currentUser.uid))

    let displayTitle = initialTopic.title;
    let displayContent = initialTopic.content;

    if (!displayTitle) {
        if (topicId === '1') {
            displayTitle = t('community_school_title');
            displayContent = t('community_school_desc');
        } else if (topicId === '2') {
            displayTitle = t('community_license_title');
            displayContent = t('community_license_desc');
        } else if (topicId === '3') {
            displayTitle = t('community_market_title');
            displayContent = t('community_market_desc');
        } else {
            displayTitle = `${t('community_discussion_title')} #${initialTopic.id}`;
            displayContent = '';
        }
    }

    return (
        <div style={{ marginTop: '2rem' }}>
            <div style={{ background: '#f9f9f9', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
                <h3 style={{ color: '#004d40', marginBottom: '1rem' }}>{displayTitle}</h3>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <div style={{ lineHeight: '1.6', color: '#333' }}>{displayContent}</div>
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
                                <span style={{ fontSize: '0.85rem', color: '#999' }}>• {reply.createdAt?.toDate ? reply.createdAt.toDate().toLocaleString() : 'Just now'}</span>
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
                                {!isAdmin && reply.status === 'pending' && (
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        background: '#fff8e1',
                                        color: '#f9a825',
                                        border: '1px solid #ffe082'
                                    }}>
                                        {t('status_pending') || 'Awaiting Approval'}
                                    </span>
                                )}
                                {!isAdmin && reply.status === 'rejected' && (
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        background: '#ffebee',
                                        color: '#c62828',
                                        border: '1px solid #ef9a9a'
                                    }}>
                                        {t('status_rejected') || 'Rejected'}
                                    </span>
                                )}
                            </div>
                            <p style={{ margin: 0, color: '#444' }}>{reply.content}</p>

                            {isAdmin && (
                                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                    {reply.status !== 'approved' && (
                                        <button
                                            onClick={() => handleUpdateStatus(reply.id, 'approved', reply.status)}
                                            style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', cursor: 'pointer', background: '#e8f5e9', border: '1px solid #a5d6a7', color: '#2e7d32', borderRadius: '4px' }}
                                        >
                                            Approve
                                        </button>
                                    )}
                                    {reply.status !== 'rejected' && (
                                        <button
                                            onClick={() => handleUpdateStatus(reply.id, 'rejected', reply.status)}
                                            style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', cursor: 'pointer', background: '#ffebee', border: '1px solid #ef9a9a', color: '#c62828', borderRadius: '4px' }}
                                        >
                                            Reject
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteReply(reply.id, reply.status)}
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

            {isAdmin && (
                <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '1.5rem' }}>
                    <div style={{ marginBottom: '1rem', fontStyle: 'italic', color: '#666' }}>
                        Posting as: <strong>{currentUser.email}</strong> {isAdmin && '(Admin)'}
                    </div>
                    <textarea
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        placeholder="Add an update or reply..."
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
                        Post Update
                    </button>
                </div>
            )}
        </div>
    )
}

