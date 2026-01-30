export default function GuideSlug({ params }) {
    const isVisa = params.slug === 'visa'

    if (isVisa) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', maxWidth: '1000px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
                {/* BLOCK 1: HERO */}
                <section style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, #e0f2f1 0%, #ffffff 100%)', padding: '3rem 2rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <h1 style={{ color: '#00695c', fontSize: '2.8rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Vietnam Visa Guide</h1>
                        <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '0.5rem', fontWeight: '500' }}>Hướng dẫn visa & lưu trú hợp pháp tại Việt Nam cho người nước ngoài</p>
                        <p style={{ maxWidth: '700px', margin: '0 auto 2.5rem auto', lineHeight: '1.6', color: '#666' }}>
                            Thông tin thực tế – cập nhật – dễ hiểu, giúp bạn tránh rủi ro pháp lý khi sinh sống và làm việc tại Việt Nam.
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
                            <div style={{ textAlign: 'left', background: 'white', padding: '1.5rem 2.5rem', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', display: 'inline-block' }}>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {[
                                        'Hiểu đúng các loại visa đang áp dụng tại Việt Nam',
                                        'Biết gia hạn visa cần giấy tờ gì, làm ở đâu',
                                        'Tránh phạt, quá hạn và các rắc rối xuất – nhập cảnh',
                                        'Phù hợp cho người mới đến và expat ở lâu dài'
                                    ].map((item, index) => (
                                        <li key={index} style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.05rem', color: '#333' }}>
                                            <span style={{ color: '#00af89', fontSize: '1.2rem', flexShrink: 0 }}>✓</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <button className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '0.8rem 2.5rem', borderRadius: '50px', boxShadow: '0 4px 15px rgba(0, 105, 92, 0.3)', transition: 'transform 0.2s' }}>
                            🔍 Kiểm tra tình trạng visa của bạn
                        </button>
                    </div>
                </section>

                {/* BLOCK 2: PAIN POINTS */}
                <section style={{ marginBottom: '5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ color: '#d32f2f', fontSize: '2rem', fontWeight: '700' }}>⚠️ Những rắc rối thường gặp</h2>
                        <p style={{ color: '#666' }}>Đừng để những vấn đề này làm gián đoạn cuộc sống của bạn tại Việt Nam</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {[
                            'Không biết visa mình có được gia hạn hay không',
                            'Làm việc nhưng đang dùng visa du lịch',
                            'Visa sắp hết hạn nhưng chưa có giấy phép lao động',
                            'Hồ sơ bị từ chối vì thiếu giấy tờ hoặc sai quy trình',
                            'Không rõ nên gia hạn, chuyển đổi hay xuất cảnh'
                        ].map((item, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1.5rem',
                                background: '#fff5f5',
                                borderLeft: '4px solid #d32f2f',
                                borderRadius: '8px',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                            }}>
                                <span style={{ color: '#d32f2f', fontSize: '1.5rem' }}>✘</span>
                                <p style={{ margin: 0, fontWeight: '500', color: '#333' }}>{item}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* BLOCK 3: VISA TYPES */}
                <section style={{ marginBottom: '5rem' }}>
                    <h2 style={{ marginBottom: '2rem', color: '#00695c', textAlign: 'center', fontSize: '2rem' }}>Các loại visa phổ biến</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {[
                            { code: 'DL', title: 'Visa du lịch', desc: 'Ngắn hạn, không được làm việc (1-3 tháng)', icon: '✈️', color: '#2196f3' },
                            { code: 'DN', title: 'Visa công tác', desc: 'Làm việc với doanh nghiệp Việt Nam', icon: '💼', color: '#3f51b5' },
                            { code: 'LĐ', title: 'Visa lao động', desc: 'Dành cho người có giấy phép lao động', icon: '🛠️', color: '#ff9800' },
                            { code: 'TT', title: 'Visa thăm thân', desc: 'Vợ/chồng/con bảo lãnh', icon: '👨‍👩‍👧', color: '#e91e63' },
                            { code: 'TRC', title: 'Thẻ tạm trú', desc: 'Lưu trú dài hạn 1–3 năm', icon: '💳', color: '#009688' },
                        ].map((visa, index) => (
                            <div key={index} style={{
                                padding: '2rem',
                                border: '1px solid #eee',
                                borderRadius: '16px',
                                background: 'white',
                                textAlign: 'center',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                            }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{visa.icon}</div>
                                <h3 style={{ marginBottom: '0.5rem', color: '#333', fontSize: '1.25rem' }}>{visa.title} <span style={{ color: visa.color, fontSize: '0.9rem', verticalAlign: 'middle', border: `1px solid ${visa.color}`, padding: '2px 6px', borderRadius: '4px' }}>{visa.code}</span></h3>
                                <p style={{ color: '#666', margin: 0, fontSize: '0.95rem' }}>{visa.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '1.5rem', textAlign: 'center', padding: '1rem', background: '#e3f2fd', borderRadius: '8px', color: '#0d47a1' }}>
                        <strong>⚠️ Lưu ý:</strong> Không phải visa nào cũng được gia hạn hoặc chuyển đổi tại Việt Nam. Hãy kiểm tra kỹ quy định!
                    </div>
                </section>

                {/* BLOCK 4: EXTENSION REQUIREMENTS */}
                <section style={{ marginBottom: '5rem', background: '#fafafa', padding: '3rem 2rem', borderRadius: '24px' }}>
                    <h2 style={{ marginBottom: '2.5rem', color: '#00695c', textAlign: 'center', fontSize: '2rem' }}>Gia hạn visa cần những gì?</h2>
                    <div style={{ display: 'grid', md: { gridTemplateColumns: '1fr 1fr' }, gap: '3rem' }}>
                        <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#333' }}>
                                <span style={{ background: '#e0f2f1', padding: '0.5rem', borderRadius: '50%' }}>📋</span> Điều kiện cơ bản
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {[
                                    'Visa hiện tại còn hạn (chưa quá hạn)',
                                    'Không vi phạm pháp luật Việt Nam',
                                    'Có lý do lưu trú hợp pháp rõ ràng'
                                ].map((item, i) => <li key={i} style={{ marginBottom: '0.8rem', paddingLeft: '1.5rem', position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: 0, color: '#009688' }}>•</span> {item}
                                </li>)}
                            </ul>
                        </div>
                        <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#333' }}>
                                <span style={{ background: '#e3f2fd', padding: '0.5rem', borderRadius: '50%' }}>📂</span> Hồ sơ cần thiết
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {[
                                    'Hộ chiếu gốc (còn hạn ≥ 6 tháng)',
                                    'Visa hiện tại (bản gốc)',
                                    'Tờ khai NA5 (có mẫu sẵn)',
                                    'Giấy xác nhận tạm trú (Công an phường)',
                                    'Giấy tờ bảo lãnh (tùy loại visa)'
                                ].map((item, i) => <li key={i} style={{ marginBottom: '0.8rem', paddingLeft: '1.5rem', position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: 0, color: '#2196f3' }}>•</span> {item}
                                </li>)}
                            </ul>
                            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #eee', fontWeight: '600', color: '#444' }}>
                                ⏱️ Thời gian xử lý: 5–7 ngày làm việc
                            </div>
                        </div>
                    </div>
                </section>

                {/* BLOCK 5: EXTENSION VS CONVERSION */}
                <section style={{ marginBottom: '5rem' }}>
                    <h2 style={{ marginBottom: '2.5rem', color: '#00695c', textAlign: 'center', fontSize: '2rem' }}>Gia hạn vs Chuyển đổi Visa</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                        {/* Gia hạn */}
                        <div style={{ padding: '2rem', background: 'white', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <span style={{ background: '#f5f5f5', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', color: '#555' }}>LỰA CHỌN 1</span>
                                <h3 style={{ marginTop: '1rem', fontSize: '1.5rem' }}>Gia hạn Visa</h3>
                                <p style={{ color: '#666' }}>Extension</p>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {[
                                    'Ở ngắn hạn thêm 1-3 tháng',
                                    'Hồ sơ đơn giản, nhanh gọn',
                                    'Ít thay đổi mục đích lưu trú'
                                ].map((item, i) => (
                                    <li key={i} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '24px', height: '24px', background: '#e0e0e0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>✓</div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Chuyển đổi */}
                        <div style={{ padding: '2rem', background: '#e0f2f1', borderRadius: '16px', border: '2px solid #009688', boxShadow: '0 8px 25px rgba(0, 150, 136, 0.15)', transform: 'scale(1.02)' }}>
                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <span style={{ background: '#009688', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>LỰA CHỌN TỐI ƯU</span>
                                <h3 style={{ marginTop: '1rem', fontSize: '1.5rem', color: '#00695c' }}>Chuyển đổi Visa</h3>
                                <p style={{ color: '#004d40' }}>Conversion / TRC</p>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {[
                                    'Muốn ở lâu dài (1 năm trở lên)',
                                    'Có công ty hoặc người thân bảo lãnh',
                                    'Có giấy phép lao động hoặc đầu tư'
                                ].map((item, i) => (
                                    <li key={i} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '500', color: '#00695c' }}>
                                        <div style={{ width: '24px', height: '24px', background: '#009688', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>★</div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* BLOCK 6: FAQ */}
                <section style={{ marginBottom: '5rem', maxWidth: '800px', margin: '0 auto 5rem auto' }}>
                    <h2 style={{ marginBottom: '2rem', color: '#00695c', textAlign: 'center', fontSize: '2rem' }}>Câu hỏi thường gặp</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { q: 'Visa du lịch có gia hạn được không?', a: 'Có, nhưng rất hạn chế và tùy thuộc vào thời điểm nhập cảnh. Nhiều trường hợp bắt buộc phải xuất cảnh và xin visa mới để quay lại (Visa Run).' },
                            { q: 'Quá hạn visa 1–2 ngày có sao không?', a: 'Dù chỉ 1 ngày cũng bị coi là vi phạm hành chính. Bạn sẽ bị phạt tiền (từ 1.250.000đ trở lên) và có thể bị liệt vào danh sách đen (Blacklist) gây khó khăn cho lần nhập cảnh sau.' },
                            { q: 'Có thể chuyển từ visa du lịch sang visa lao động không?', a: 'Được, NHƯNG bạn cần có công ty bảo lãnh và Giấy phép lao động (Work Permit) đầy đủ. Thủ tục này có thể thực hiện mà không cần xuất cảnh trong một số trường hợp.' },
                            { q: 'Gia hạn visa và gia hạn lưu trú khác nhau thế nào?', a: 'Gia hạn Visa (Visa Extension) là cấp tờ rời mới. Gia hạn tạm trú (Stay Extension) là đóng dấu gia hạn trên hộ chiếu. Về cơ bản mục đích giống nhau là được ở lại thêm.' }
                        ].map((item, index) => (
                            <div key={index} style={{ padding: '1.5rem', background: 'white', border: '1px solid #eee', borderRadius: '12px' }}>
                                <h4 style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '1.1rem' }}>❓ {item.q}</h4>
                                <p style={{ margin: 0, color: '#555', lineHeight: '1.6', paddingLeft: '1.8rem' }}>{item.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* BLOCK 7: CTA */}
                <section style={{ textAlign: 'center', background: 'linear-gradient(135deg, #00695c 0%, #004d40 100%)', color: 'white', padding: '4rem 2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0, 77, 64, 0.3)' }}>
                    <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', fontWeight: '800' }}>Không chắc visa của bạn có hợp pháp?</h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem auto', opacity: '0.9' }}>
                        Mỗi hồ sơ một khác biệt. Chúng tôi giúp bạn kiểm tra miễn phí tình trạng visa và tư vấn giải pháp tối ưu nhất.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <button className="btn" style={{
                            background: 'white',
                            color: '#00695c',
                            fontWeight: '800',
                            padding: '1rem 3rem',
                            fontSize: '1.2rem',
                            border: 'none',
                            borderRadius: '50px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}>
                            📩 Nhận tư vấn MIỄN PHÍ
                        </button>
                        <span style={{ fontSize: '0.95rem', opacity: 0.8, marginTop: '1rem' }}>Cam kết bảo mật thông tin 100%</span>
                    </div>
                </section>

                {/* BLOCK 8: TRUST SIGNAL */}
                <section style={{ textAlign: 'center', marginTop: '4rem', color: '#777', fontSize: '0.95rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>🛡️ Kinh nghiệm 5+ năm</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>⚖️ Hiểu rõ luật VN</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>🤝 Tư vấn minh bạch</span>
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
        </div>
    )
}
