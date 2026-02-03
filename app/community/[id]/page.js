
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
    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            {params.id === '2' ? (
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
                <>
                    <h1>Discussion Topic #{params.id}</h1>
                    <div style={{ background: 'white', padding: '2rem', marginBottom: '2rem', borderRadius: '8px' }}>
                        <p>Original post content goes here. This is where the user asks their question.</p>
                    </div>
                </>
            )}

            <h3>Replies</h3>
            <div style={{ marginLeft: '2rem', borderLeft: '2px solid #eee', paddingLeft: '1rem' }}>
                <p><strong>ReplyUser1:</strong> Good question! I think...</p>
                <br />
                <p><strong>ReplyUser2:</strong> I disagree, usually it's better to...</p>
            </div>
        </div>
    )
}
