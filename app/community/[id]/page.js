export default function TopicPage({ params }) {
    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <h1>Discussion Topic #{params.id}</h1>
            <div style={{ background: 'white', padding: '2rem', marginBottom: '2rem', borderRadius: '8px' }}>
                <p>Original post content goes here. This is where the user asks their question.</p>
            </div>

            <h3>Replies</h3>
            <div style={{ marginLeft: '2rem', borderLeft: '2px solid #eee', paddingLeft: '1rem' }}>
                <p><strong>ReplyUser1:</strong> Good question! I think...</p>
                <br />
                <p><strong>ReplyUser2:</strong> I disagree, usually it's better to...</p>
            </div>
        </div>
    )
}
