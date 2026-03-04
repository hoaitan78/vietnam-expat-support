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

        const isApproved = isAdmin;

        // 1. Pre-generate ID for offline usage
        const newReplyRef = doc(collection(db, 'topics', topicId, 'replies'));

        const replyData = {
            user: currentUser.email,
            userId: currentUser.uid,
            content: newReply,
            createdAt: new Date(), // Temporary for UI optimistic update
            status: isApproved ? 'approved' : 'pending' // Admins auto-approve their own posts
        }

        // 2. Immediate UI Update
        const tempReply = { ...replyData, id: newReplyRef.id };
        setReplies([...replies, tempReply]);
        setNewReply('');

        try {
            // Restore server timestamp for Firestore
            replyData.createdAt = serverTimestamp();

            // 3. Parallel write
            const promises = [setDoc(newReplyRef, replyData)];

            if (isApproved) {
                const topicRef = doc(db, 'topics', topicId);
                promises.push(setDoc(topicRef, {
                    repliesCount: increment(1)
                }, { merge: true }));
            }

            await Promise.all(promises);

            if (!isApproved) {
                alert(t('reply_pending_approval') || 'Your reply has been submitted and is awaiting admin approval.')
            }
        } catch (error) {
            console.error("Error posting reply:", error)
            // Revert UI on failure
            setReplies(current => current.filter(r => r.id !== newReplyRef.id))
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

    // Assuming ALL posts are now from the Admin, or we only want to show Admin posts in this new format.
    const adminReplies = replies.filter(r => ADMIN_EMAILS.some(email => email.toLowerCase() === r.user.toLowerCase()))

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
                    {adminReplies.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {adminReplies.map((reply, index) => (
                                <div key={reply.id} style={{ paddingBottom: index !== adminReplies.length - 1 ? '1.5rem' : '0', borderBottom: index !== adminReplies.length - 1 ? '1px solid #eee' : 'none' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                                        <strong style={{ color: '#00695c', fontSize: '1.1rem' }}>{reply.user} (Admin Update)</strong>
                                        <span style={{ fontSize: '0.9rem', color: '#666' }}>• {reply.createdAt?.toDate ? reply.createdAt.toDate().toLocaleString() : 'Vừa xong'}</span>
                                    </div>
                                    <p style={{ margin: 0, color: '#333', fontSize: '1.05rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{reply.content}</p>

                                    {isAdmin && (
                                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleDeleteReply(reply.id, reply.status)}
                                                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', cursor: 'pointer', background: '#ffebee', border: '1px solid #ef9a9a', color: '#c62828', borderRadius: '4px' }}
                                            >
                                                Delete Update
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ lineHeight: '1.6', color: '#333' }}>{displayContent}</div>
                    )}
                </div>
            </div>

            {isAdmin && (
                <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
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

