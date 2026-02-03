'use client'

import { useLanguage } from '../../../contexts/LanguageContext'
import Link from 'next/link'

export default function DrivingLicensePage() {
    const { t } = useLanguage()

    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '1000px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
            {/* HERO */}
            <section style={{ textAlign: 'center', marginBottom: '5rem' }}>
                <div style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)', padding: '3rem 2rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h1 style={{ color: '#0d47a1', fontSize: '2.8rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Driving License Exchange</h1>
                    <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '0.5rem', fontWeight: '500' }}>Hướng dẫn đổi bằng lái xe nước ngoài sang bằng Việt Nam</p>
                    <p style={{ maxWidth: '700px', margin: '0 auto 2.5rem auto', lineHeight: '1.6', color: '#666' }}>
                        Bạn muốn lái xe hợp pháp tại Việt Nam? Hãy đổi bằng lái xe quốc tế của bạn sang bằng lái xe Việt Nam (PET) để tránh rắc rối với cảnh sát giao thông và bảo hiểm.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
                        <div style={{ textAlign: 'left', background: 'white', padding: '1.5rem 2.5rem', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', display: 'inline-block' }}>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {[
                                    'Không cần thi lại lý thuyết hay thực hành',
                                    'Có giá trị sử dụng trên toàn lãnh thổ Việt Nam',
                                    'Thủ tục nhanh gọn, nhận bằng sau 5-7 ngày',
                                    'Hồi sơ đơn giản, chi phí hợp lý'
                                ].map((item, index) => (
                                    <li key={index} style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.05rem', color: '#333' }}>
                                        <span style={{ color: '#1976d2', fontSize: '1.2rem', flexShrink: 0 }}>✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 1. ELIGIBILITY */}
            <section style={{ marginBottom: '5rem' }}>
                <h2 style={{ color: '#0d47a1', fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>1. Ai đủ điều kiện đổi bằng?</h2>
                <div style={{ display: 'grid', md: { gridTemplateColumns: '1fr 1fr' }, gap: '2rem' }}>
                    <div style={{ background: '#f1f8e9', padding: '2rem', borderRadius: '16px', borderLeft: '5px solid #66bb6a' }}>
                        <h3 style={{ color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ fontSize: '1.5rem' }}>📋</span> Đối tượng áp dụng</h3>
                        <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
                            <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                                <span>✅</span> Người nước ngoài cư trú, làm việc, học tập tại Việt Nam ít nhất 3 tháng.
                            </li>
                            <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                                <span>✅</span> Giấy phép lái xe nước ngoài còn đủ thời hạn sử dụng, không bị rách nát, tẩy xóa.
                            </li>
                            <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                                <span>✅</span> Có Visa hoặc Thẻ tạm trú (TRC) còn thời hạn.
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 2. REQUIRED DOCUMENTS */}
            <section style={{ marginBottom: '5rem' }}>
                <h2 style={{ color: '#0d47a1', fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>2. Hồ sơ cần chuẩn bị</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    {[
                        { title: 'Đơn đề nghị', icon: '📝', desc: 'Mẫu đơn đề nghị đổi giấy phép lái xe (theo mẫu quy định).' },
                        { title: 'Bản dịch thuật', icon: '📄', desc: 'Bản dịch giấy phép lái xe nước ngoài ra tiếng Việt được công chứng.' },
                        { title: 'Hộ chiếu & Visa', icon: '🛂', desc: 'Bản sao hộ chiếu (phần ảnh và visa/TRC) - Mang bản chính để đối chiếu.' },
                        { title: 'Bằng lái gốc', icon: '💳', desc: 'Giấy phép lái xe nước ngoài (bản gốc) để đối chiếu.' },
                        { title: 'Ảnh thẻ', icon: '📸', desc: '02 ảnh 3x4 hoặc 4x6 (phông nền trắng) chụp không quá 6 tháng.' },
                        { title: 'Phí lệ phí', icon: '💵', desc: '135.000 VNĐ (lệ phí cấp đổi bằng lái xe theo quy định nhà nước).' }
                    ].map((item, i) => (
                        <div key={i} style={{ padding: '2rem', background: 'white', border: '1px solid #eee', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{item.icon}</div>
                            <h3 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{item.title}</h3>
                            <p style={{ color: '#666', fontSize: '0.95rem' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. PROCESS */}
            <section style={{ marginBottom: '5rem' }}>
                <h2 style={{ color: '#0d47a1', fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>3. Quy trình thực hiện</h2>
                <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
                    {[
                        { step: '1', title: 'Nộp hồ sơ', desc: 'Nộp hồ sơ trực tiếp tại Sở Giao thông Vận tải hoặc Tổng cục Đường bộ Việt Nam.' },
                        { step: '2', title: 'Chụp ảnh', desc: 'Đến nơi nộp hồ sơ để chụp ảnh trực tiếp in lên bằng lái (không dùng ảnh mang theo).' },
                        { step: '3', title: 'Đóng lệ phí', desc: 'Đóng lệ phí cấp đổi giấy phép lái xe (khoảng 135.000 VNĐ).' },
                        { step: '4', title: 'Nhận giấy hẹn', desc: 'Nhận giấy hẹn trả kết quả.' },
                        { step: '5', title: 'Nhận bằng', desc: 'Đến nhận bằng theo lịch hẹn hoặc đăng ký gửi qua bưu điện (khoảng 5-7 ngày làm việc).' }
                    ].map((step, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', alignItems: 'flex-start' }}>
                            <div style={{ background: '#1976d2', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                                {step.step}
                            </div>
                            <div>
                                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1565c0' }}>{step.title}</h3>
                                <p style={{ margin: 0, color: '#555' }}>{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section style={{ textAlign: 'center', background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)', color: 'white', padding: '4rem 2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(21, 101, 192, 0.3)' }}>
                <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', fontWeight: '800' }}>Cần hỗ trợ dịch vụ?</h2>
                <p style={{ fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem auto', opacity: '0.9' }}>
                    Nếu bạn gặp khó khăn về ngôn ngữ hoặc thủ tục, chúng tôi có thể giới thiệu các đơn vị dịch vụ uy tín để hỗ trợ bạn trọn gói.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link href="/contact" className="btn" style={{
                        background: 'white',
                        color: '#1565c0',
                        fontWeight: '800',
                        padding: '1rem 3rem',
                        fontSize: '1.2rem',
                        border: 'none',
                        borderRadius: '50px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        display: 'inline-block'
                    }}>
                        Liên hệ ngay
                    </Link>
                </div>
            </section>
        </div>
    )
}
