'use client'

import { useLanguage } from '../../../contexts/LanguageContext'
import Link from 'next/link'
import styles from './page.module.css'

export default function HousingPage() {
    const { t } = useLanguage()

    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '1000px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
            {/* HERO */}
            <section style={{ textAlign: 'center', marginBottom: '5rem' }}>
                <div style={{ background: 'linear-gradient(135deg, #fff3e0 0%, #ffffff 100%)', padding: '3rem 2rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h1 style={{ color: '#e65100', fontSize: '2.8rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.02em' }}>{t('housing_hero_title')}</h1>
                    <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '0.5rem', fontWeight: '500' }}>{t('housing_sub')}</p>
                    <p style={{ maxWidth: '700px', margin: '0 auto 2.5rem auto', lineHeight: '1.6', color: '#666' }}>
                        {t('housing_intro')}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
                        <div style={{ textAlign: 'left', background: 'white', padding: '1.5rem 2.5rem', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', display: 'inline-block' }}>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {[
                                    'Kinh nghiệm thực tế thuê nhà an toàn',
                                    'Các loại hình nhà ở phổ biến & Giá cả',
                                    'Lưu ý quan trọng về Hợp đồng & Pháp lý',
                                    'Tránh các tranh chấp không đáng có'
                                ].map((item, index) => (
                                    <li key={index} style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.05rem', color: '#333' }}>
                                        <span style={{ color: '#ef6c00', fontSize: '1.2rem', flexShrink: 0 }}>✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 1. CAN FOREIGNERS RENT? */}
            <section style={{ marginBottom: '5rem' }}>
                <h2 style={{ color: '#e65100', fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>{t('housing_sec1_title')}</h2>
                <div style={{ display: 'grid', md: { gridTemplateColumns: '1fr 1fr' }, gap: '2rem' }}>
                    <div style={{ background: '#f1f8e9', padding: '2rem', borderRadius: '16px', borderLeft: '5px solid #66bb6a' }}>
                        <h3 style={{ color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ fontSize: '1.5rem' }}>👉</span> {t('housing_sec1_yes')}</h3>
                        <p>Theo pháp luật Việt Nam, bạn được thuê nhà hợp pháp để ở hoặc làm việc nếu:</p>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {['Có visa còn hiệu lực hoặc thẻ tạm trú', 'Có hợp đồng thuê nhà hợp pháp', 'Thực hiện khai báo tạm trú với công an'].map((item, i) => (
                                <li key={i} style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}><span>✅</span> {item}</li>
                            ))}
                        </ul>
                    </div>
                    <div style={{ background: '#ffebee', padding: '2rem', borderRadius: '16px', borderLeft: '5px solid #ef5350' }}>
                        <h3 style={{ color: '#c62828', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ fontSize: '1.5rem' }}>⚠️</span> {t('housing_sec1_note')}</h3>
                        <p style={{ fontStyle: 'italic', fontWeight: '500' }}>
                            "Người nước ngoài không được tự ý thuê nhà không hợp đồng hoặc thuê “miệng”, dù giá rẻ."
                        </p>
                        <p>Rủi ro pháp lý rất cao và bạn có thể bị phạt hoặc trục xuất nếu không tuân thủ quy định đăng ký tạm trú.</p>
                    </div>
                </div>
            </section>

            {/* 2. TYPES OF HOUSING */}
            <section style={{ marginBottom: '5rem' }}>
                <h2 style={{ color: '#e65100', fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>{t('housing_sec2_title')}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {[
                        { title: 'Căn hộ chung cư', icon: '🏢', feature: 'An ninh, tiện ích', target: 'Độc thân, Cặp đôi', desc: 'Phổ biến ở khu trung tâm và ven biển. Có bảo vệ, lễ tân.' },
                        { title: 'Nhà riêng', icon: '🏠', feature: 'Rộng rãi, Riêng tư', target: 'Gia đình', desc: 'Không gian thoải mái nhưng cần kiểm tra kỹ pháp lý và an ninh khu vực.' },
                        { title: 'Căn hộ dịch vụ', icon: '🏨', feature: 'Trọn gói, Tiện lợi', target: 'Người mới đến', desc: 'Đã bao gồm dọn phòng, internet, điện nước. Giá cao hơn nhưng ít rủi ro.' }
                    ].map((item, i) => (
                        <div key={i} style={{ padding: '2rem', background: 'white', border: '1px solid #eee', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{item.icon}</div>
                            <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>{item.title}</h3>
                            <div style={{ marginBottom: '1rem' }}>
                                <span style={{ background: '#fff3e0', color: '#e65100', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem', marginRight: '0.5rem' }}>{item.feature}</span>
                            </div>
                            <p style={{ color: '#666', fontSize: '0.95rem' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. LOCATIONS & 4. PRICES */}
            <section style={{ marginBottom: '5rem', display: 'grid', md: { gridTemplateColumns: '1fr 1fr' }, gap: '3rem' }}>
                <div>
                    <h2 style={{ color: '#e65100', fontSize: '1.8rem', marginBottom: '1.5rem' }}>{t('housing_sec3_title')}</h2>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {[
                            { area: 'Trung tâm thành phố', desc: 'Gần biển, tiện sinh hoạt' },
                            { area: 'Khu ven biển Trần Phú', desc: 'Giá cao, tiện du lịch' },
                            { area: 'Khu Vĩnh Hải – Vĩnh Phước', desc: 'Yên tĩnh, giá hợp lý' },
                            { area: 'Khu phía Nam', desc: 'Phù hợp ở lâu dài, ít du lịch' }
                        ].map((loc, i) => (
                            <li key={i} style={{ marginBottom: '1rem', padding: '1rem', background: '#fafafa', borderRadius: '8px' }}>
                                <strong>📍 {loc.area}:</strong> <span style={{ color: '#666' }}>{loc.desc}</span>
                            </li>
                        ))}
                    </ul>
                    <div style={{ background: '#fff3e0', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                        <strong>💡 Kinh nghiệm:</strong> Không nên chọn nhà chỉ vì “gần biển”, hãy cân nhắc đi lại, chợ, bệnh viện và môi trường sống lâu dài.
                    </div>
                </div>
                <div>
                    <h2 style={{ color: '#e65100', fontSize: '1.8rem', marginBottom: '1.5rem' }}>{t('housing_sec4_title')}</h2>
                    <div style={{ background: 'white', border: '1px solid #eee', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                        <p>Giá thuê phụ thuộc vào: <strong>Vị trí, Diện tích, Nội thất, Thời hạn.</strong></p>
                        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '1rem 0' }} />
                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Căn hộ 1 phòng ngủ</span>
                            <strong>Trung bình – Khá</strong>
                        </div>
                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Nhà riêng</span>
                            <strong>Cao hơn (tùy khu)</strong>
                        </div>
                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Căn hộ dịch vụ</span>
                            <strong>Cao nhất (an toàn)</strong>
                        </div>
                        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#d32f2f', fontStyle: 'italic' }}>
                            ⚠️ Giá thuê cho người nước ngoài có thể cao hơn người Việt nếu không thương lượng tốt.
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. CONTRACT & 6. UTILITIES */}
            <section style={{ marginBottom: '5rem' }}>
                <div style={{ background: '#fff8e1', padding: '3rem 2rem', borderRadius: '24px' }}>
                    <h2 style={{ color: '#f57f17', textAlign: 'center', marginBottom: '2rem' }}>{t('housing_sec5_title')}</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <div>
                            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Điều khoản Hợp đồng cần soi kỹ:</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {[
                                    'Thông tin chủ nhà (đúng người, đúng giấy tờ)',
                                    'Thời hạn thuê và điều kiện chấm dứt',
                                    'Tiền đặt cọc (thường 1–2 tháng)',
                                    'Ai chịu chi phí sửa chữa?',
                                    'Điều kiện hoàn cọc (Rất quan trọng!)'
                                ].map((item, i) => (
                                    <li key={i} style={{ marginBottom: '0.8rem', display: 'flex', gap: '0.5rem' }}><span>🔍</span> {item}</li>
                                ))}
                            </ul>
                            <p style={{ fontWeight: 'bold', color: '#f57f17' }}>👉 Hợp đồng nên song ngữ Việt – Anh!</p>
                        </div>
                        <div>
                            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Điện, Nước, Internet:</h3>
                            <p style={{ fontSize: '0.95rem', color: '#555' }}>Người nước ngoài thường gặp vấn đề với giá điện cao hoặc phí quản lý không rõ ràng.</p>
                            <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
                                <strong>Trước khi ký, hãy hỏi rõ:</strong>
                                <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem', marginBottom: 0 }}>
                                    <li>Cách tính tiền điện, nước (giá nhà nước hay kinh doanh?)</li>
                                    <li>Có hóa đơn hay không?</li>
                                    <li>Internet do ai lắp đặt và trả phí?</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. REGISTRATION & 8. RISKS */}
            <section style={{ marginBottom: '5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div style={{ padding: '2rem', border: '2px solid #2196f3', borderRadius: '16px', background: '#e3f2fd' }}>
                    <h2 style={{ color: '#1565c0', marginBottom: '1rem', fontSize: '1.5rem' }}>{t('housing_sec7_title')}</h2>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '1rem' }}>👮 Phải khai báo trong vòng <strong>24 giờ</strong> sau khi đến.</li>
                        <li style={{ marginBottom: '1rem' }}>🏠 Thường do chủ nhà thực hiện.</li>
                        <li style={{ marginBottom: '1rem' }}>⚠️ Nếu chủ nhà không làm, bạn vẫn có thể bị phạt.</li>
                    </ul>
                    <p style={{ fontSize: '0.9rem', color: '#0d47a1' }}>Ảnh hưởng: Không gia hạn được Visa/TRC nếu thiếu giấy này.</p>
                </div>
                <div style={{ padding: '2rem', border: '2px solid #ef5350', borderRadius: '16px', background: '#ffebee' }}>
                    <h2 style={{ color: '#c62828', marginBottom: '1rem', fontSize: '1.5rem' }}>{t('housing_sec8_title')}</h2>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}>🚫 Chủ nhà không có quyền cho thuê</li>
                        <li style={{ marginBottom: '0.5rem' }}>💸 Mất tiền cọc vô lý</li>
                        <li style={{ marginBottom: '0.5rem' }}>📜 Hợp đồng mập mờ, bất lợi</li>
                        <li style={{ marginBottom: '0.5rem' }}>🕵️ Không khai báo tạm trú</li>
                    </ul>
                    <p style={{ fontSize: '0.9rem', color: '#b71c1c', fontWeight: 'bold' }}>Ghi nhớ: Giá rẻ nhưng pháp lý không rõ ràng = Rủi ro cao.</p>
                </div>
            </section>

            {/* 9. TIPS & CTA */}
            <section style={{ textAlign: 'center', background: 'linear-gradient(135deg, #e65100 0%, #ff9800 100%)', color: 'white', padding: '4rem 2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(230, 81, 0, 0.3)' }}>
                <h2 style={{ fontSize: '2.2rem', marginBottom: '2rem', fontWeight: '800' }}>{t('housing_cta_title')}</h2>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
                    {['Không chuyển tiền trước khi xem nhà', 'Chụp ảnh hiện trạng khi nhận', 'Giữ bản sao giấy tờ', 'Hỏi kỹ quy định tiếng ồn/khách'].map((tip, i) => (
                        <span key={i} style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.95rem' }}>⭐ {tip}</span>
                    ))}
                </div>

                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{t('housing_cta_sub')}</h3>
                <p style={{ fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem auto', opacity: '0.9' }}>
                    Chúng tôi hỗ trợ bạn từ khâu tìm nhà đến hoàn tất thủ tục pháp lý, kiểm tra hợp đồng và đăng ký tạm trú.
                </p>
                <button className="btn" style={{
                    background: 'white',
                    color: '#e65100',
                    fontWeight: '800',
                    padding: '1rem 3rem',
                    fontSize: '1.2rem',
                    border: 'none',
                    borderRadius: '50px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                }}>
                    {t('housing_cta_btn')}
                </button>
            </section>
        </div>
    )
}
