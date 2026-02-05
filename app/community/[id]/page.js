import DiscussionSection from '../../components/DiscussionSection'

export async function generateMetadata({ params }) {
    const title = params.id === '2'
        ? 'Các khu vực tập trung nhiều người nước ngoài ở Nha Trang'
        : `Discussion Topic #${params.id}`;

    return {
        title: `${title} - Vietnam Expat Support`,
        description: `Join the discussion about ${title} in our community forum.`
    }
}

export default function TopicPage({ params }) {
    const isSpecialTopic = params.id === '2'

    // Mock data for the specific discussion
    const topic = {
        id: params.id,
        content: isSpecialTopic
            ? 'Nha Trang có 3 khu vực chính mà cộng đồng người nước ngoài thường lựa chọn sinh sống: Khu Phố Tây (Tân Lập), Khu An Viên, và Khu Vĩnh Điềm Trung / Vĩnh Hải.'
            : 'Original post content goes here. This is where the user asks their question. How can I find the best visa agent in town?'
    }

    const initialReplies = [
        { id: 101, user: 'John Doe', content: 'Good question! I recommend checking the Visa Guide section.', time: '2 hours ago' },
        { id: 102, user: 'Jane Smith', content: 'I used a local agent near the center, very fast service.', time: '1 hour ago' }
    ]

    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
            {isSpecialTopic ? (
                <>
                    <h1>Các khu vực tập trung nhiều người nước ngoài ở Nha Trang</h1>
                    <div style={{ background: 'white', padding: '2rem', marginBottom: '2rem', borderRadius: '8px' }}>
                        <p>Nha Trang có 3 khu vực chính mà cộng đồng người nước ngoài thường lựa chọn sinh sống:</p>
                        <ul>
                            <li><strong>Khu Phố Tây (Tân Lập):</strong> Sôi động, nhiều nhà hàng, quán bar, thuận tiện du lịch.</li>
                            <li><strong>Khu An Viên:</strong> Yên tĩnh, cao cấp, an ninh tốt, thích hợp nghỉ dưỡng.</li>
                            <li><strong>Khu Vĩnh Điềm Trung / Vĩnh Hải:</strong> Giá cả phải chăng, gần gũi với cuộc sống người dân địa phương.</li>
                        </ul>
                    </div>
                </>
            ) : (
                <DiscussionSection initialTopic={topic} initialReplies={initialReplies} />
            )}
        </div>
    )
}
