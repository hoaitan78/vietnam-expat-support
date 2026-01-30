export default function GuideSlug({ params }) {
    const isVisa = params.slug === 'visa'

    if (isVisa) {
        return (
            <div className="container" style={{ padding: '4rem 1rem' }}>
                {/* BLOCK 1: HERO */}
                <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ color: 'var(--color-primary)', fontSize: '2.5rem', marginBottom: '1rem' }}>Vietnam Visa Guide</h1>
                    <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '2rem' }}>Hướng dẫn visa & lưu trú hợp pháp tại Việt Nam cho người nước ngoài</p>
                    <p style={{ maxWidth: '800px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
                        Thông tin thực tế – cập nhật – dễ hiểu, giúp bạn tránh rủi ro pháp lý khi sinh sống và làm việc tại Việt Nam.
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2.5rem' }}>
                        {[
                            'Hiểu đúng các loại visa đang áp dụng tại Việt Nam',
                            'Biết gia hạn visa cần giấy tờ gì, làm ở đâu',
                            'Tránh phạt, quá hạn và các rắc rối xuất – nhập cảnh',
                            'Phù hợp cho người mới đến và expat ở lâu dài'
                        ].map((item, index) => (
                            <li key={index} style={{ marginBottom: '0.5rem' }}>✅ {item}</li>
                        ))}
                    </ul>
                    <button className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>🔍 Kiểm tra tình trạng visa của bạn</button>
                </section>

                {/* BLOCK 2: PAIN POINTS */}
                <section style={{ marginBottom: '4rem', background: '#fff0f0', padding: '2rem', borderRadius: '12px' }}>
                    <h2 style={{ color: '#d32f2f', marginBottom: '1.5rem' }}>Những rắc rối visa người nước ngoài thường gặp</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        {[
                            'Không biết visa mình có được gia hạn hay không',
                            'Làm việc nhưng đang dùng visa du lịch',
                            'Visa sắp hết hạn nhưng chưa có giấy phép lao động',
                            'Hồ sơ bị từ chối vì thiếu giấy tờ hoặc sai quy trình',
                            'Không rõ nên gia hạn, chuyển đổi hay xuất cảnh'
                        ].map((item, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                <span style={{ color: '#d32f2f', fontSize: '1.2rem' }}>⚠️</span>
                                <p style={{ margin: 0 }}>{item}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* BLOCK 3: VISA TYPES */}
                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Các loại visa phổ biến cho người nước ngoài tại Việt Nam</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                        {[
                            { code: 'DL', title: 'Visa du lịch', desc: 'Ngắn hạn, không được làm việc' },
                            { code: 'DN', title: 'Visa công tác', desc: 'Làm việc với doanh nghiệp Việt Nam' },
                            { code: 'LĐ', title: 'Visa lao động', desc: 'Có giấy phép lao động' },
                            { code: 'TT', title: 'Visa thăm thân', desc: 'Vợ/chồng/con bảo lãnh' },
                            { code: 'TRC', title: 'Thẻ tạm trú', desc: 'Lưu trú dài hạn 1–3 năm' },
                        ].map((visa, index) => (
                            <div key={index} style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>
                                <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-secondary)' }}>{visa.title} ({visa.code})</h3>
                                <p style={{ color: '#666', margin: 0 }}>{visa.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '1rem', fontStyle: 'italic', color: '#666' }}>
                        ⚠️ Không phải visa nào cũng được gia hạn hoặc chuyển đổi tại Việt Nam.
                    </div>
                </section>

                {/* BLOCK 4: EXTENSION REQUIREMENTS */}
                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Gia hạn visa tại Việt Nam cần những gì?</h2>
                    <div style={{ display: 'grid', md: { gridTemplateColumns: '1fr 1fr' }, gap: '2rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Điều kiện cơ bản</h3>
                            <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
                                <li>Visa hiện tại còn hạn</li>
                                <li>Không vi phạm pháp luật</li>
                                <li>Có lý do lưu trú hợp pháp</li>
                            </ul>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Hồ sơ thường gồm</h3>
                            <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem' }}>
                                <li>Hộ chiếu gốc (còn hạn ≥ 6 tháng)</li>
                                <li>Visa hiện tại</li>
                                <li>Tờ khai NA5</li>
                                <li>Giấy xác nhận tạm trú</li>
                                <li>Giấy tờ bảo lãnh (tùy loại visa)</li>
                            </ul>
                            <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>
                                ⏱️ Thời gian xử lý: 5–7 ngày làm việc
                            </div>
                        </div>
                    </div>
                </section>

                {/* BLOCK 5: EXTENSION VS CONVERSION */}
                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Khi nào nên gia hạn, khi nào nên chuyển đổi visa?</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <div style={{ padding: '1.5rem', background: '#f9f9f9', borderRadius: '8px' }}>
                            <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Gia hạn visa</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '0.5rem' }}>✅ Ở ngắn hạn</li>
                                <li style={{ marginBottom: '0.5rem' }}>✅ Hồ sơ đơn giản</li>
                                <li style={{ marginBottom: '0.5rem' }}>✅ Ít thay đổi mục đích lưu trú</li>
                            </ul>
                        </div>
                        <div style={{ padding: '1.5rem', background: '#e6fffa', borderRadius: '8px', border: '1px solid var(--color-primary)' }}>
                            <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--color-primary)' }}>Chuyển đổi visa</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '0.5rem' }}>⭐ Muốn ở lâu dài</li>
                                <li style={{ marginBottom: '0.5rem' }}>⭐ Có công ty hoặc người thân bảo lãnh</li>
                                <li style={{ marginBottom: '0.5rem' }}>⭐ Có giấy phép lao động / đầu tư</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* BLOCK 6: FAQ */}
                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Câu hỏi thường gặp (FAQ)</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {[
                            { q: 'Visa du lịch có gia hạn được không?', a: '→ Có, nhưng rất hạn chế. Nhiều trường hợp phải xuất cảnh.' },
                            { q: 'Quá hạn visa 1–2 ngày có sao không?', a: '→ Có thể bị phạt và ảnh hưởng lần xin visa sau.' },
                            { q: 'Có thể chuyển từ visa du lịch sang visa lao động không?', a: '→ Có thể, nhưng phải đủ điều kiện và hồ sơ hợp lệ.' },
                            { q: 'Gia hạn visa và gia hạn lưu trú có giống nhau không?', a: '→ Không. Hai thủ tục khác nhau và dễ bị nhầm lẫn.' }
                        ].map((item, index) => (
                            <div key={index} style={{ paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                                <h4 style={{ margin: '0 0 0.5rem 0' }}>{item.q}</h4>
                                <p style={{ margin: 0, color: '#555' }}>{item.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* BLOCK 7: CTA */}
                <section style={{ textAlign: 'center', background: 'var(--color-primary)', color: 'white', padding: '3rem 1rem', borderRadius: '12px' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Không chắc visa của bạn có hợp pháp?</h2>
                    <p style={{ fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                        Mỗi trường hợp visa đều khác nhau. Chúng tôi giúp bạn kiểm tra tình trạng visa, tư vấn phương án phù hợp và tránh rủi ro pháp lý.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <button className="btn" style={{ background: 'white', color: 'var(--color-primary)', fontWeight: 'bold', padding: '1rem 2rem', fontSize: '1.1rem', border: 'none' }}>
                            📩 Nhận tư vấn visa cá nhân
                        </button>
                        <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Hoặc để lại thông tin – chúng tôi sẽ liên hệ trong 24h</span>
                    </div>
                </section>

                {/* BLOCK 8: TRUST SIGNAL */}
                <section style={{ textAlign: 'center', marginTop: '3rem', color: '#666', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                        <span>🛡️ Kinh nghiệm làm việc với expat nhiều quốc tịch</span>
                        <span>⚖️ Hiểu rõ quy định pháp luật Việt Nam</span>
                        <span>🤝 Tư vấn minh bạch – đúng luật – không hứa suông</span>
                    </div>
                </section>
            </div>

        )
    }

    // Fallback for other slugs
    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <h1>Guide: {params.slug}</h1>
            <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                This is a placeholder for the content of the guide. In a real application, this would fetch markdown content based on the slug.
            </p>
            <article style={{ lineHeight: '1.8' }}>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...</p>
                <p>Detailed information about <strong>{params.slug}</strong> will reside here.</p>
            </article>
        </div>
    )
}
