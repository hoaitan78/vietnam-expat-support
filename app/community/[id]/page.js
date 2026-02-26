export const dynamic = 'force-dynamic';

import DiscussionSection from '../../../components/DiscussionSection'
import { db } from '../../../lib/firebase'
import { doc, getDoc } from 'firebase/firestore'



export async function generateMetadata({ params }) {
    return {
        title: `Community Discussion - Vietnam Expat Support`,
        description: `Join the community discussion`
    }
}

export default async function TopicPage({ params }) {
    // Note: in a pure App Router we might fetch data directly here if it's a server component
    // But since TopicPage might be rendered on client (or DiscussionSection is client),
    // we can either fetch here (if it's an async component) or pass ID. Let's make it an async Server Component to fetch initial data.

    // As per Next.js app dir, we can await data here.
    let topic = null;
    const isPredefined = ['1', '2', '3'].includes(params?.id);

    try {
        const docRef = doc(db, 'topics', params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            topic = {
                id: docSnap.id,
                title: data.title || '',
                content: data.content || '',
                user: data.user || '',
                repliesCount: data.repliesCount || 0,
                // Sanitize createdAt to a string if it's a Firebase Timestamp
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null
            };
        } else if (isPredefined) {
            topic = { id: params.id };
        }
    } catch (error) {
        console.error("Error fetching topic for SSR:", error);
        // Fallback for predefined topics if Firebase fails on server
        if (isPredefined) {
            topic = { id: params.id };
        }
    }

    if (!topic) {
        return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Topic not found</div>
    }

    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
            <DiscussionSection topicId={resolvedParams.id} initialTopic={topic} />
        </div>
    )
}
