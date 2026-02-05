'use client'

import { useState } from 'react'
import { useLanguage } from '../../../contexts/LanguageContext'
import Link from 'next/link'
import ContactModal from '../../../components/ContactModal'

export default function DrivingLicensePage() {
    const { t } = useLanguage()
    const [showContactModal, setShowContactModal] = useState(false)

    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '1000px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
            <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />

            {/* HERO */}
            <section style={{ textAlign: 'center', marginBottom: '5rem' }}>
                <div style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)', padding: '3rem 2rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h1 style={{ color: '#0d47a1', fontSize: '2.8rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.02em' }}>{t('dl_title')}</h1>
                    <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '0.5rem', fontWeight: '500' }}>{t('dl_sub')}</p>
                    <p style={{ maxWidth: '700px', margin: '0 auto 2.5rem auto', lineHeight: '1.6', color: '#666' }}>
                        {t('dl_intro')}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
                        <div style={{ textAlign: 'left', background: 'white', padding: '1.5rem 2.5rem', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', display: 'inline-block' }}>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {(t('dl_hero_list') || []).map((item, index) => (
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
                <h2 style={{ color: '#0d47a1', fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>{t('dl_sec1_title')}</h2>
                <div style={{ display: 'grid', md: { gridTemplateColumns: '1fr 1fr' }, gap: '2rem' }}>
                    <div style={{ background: '#f1f8e9', padding: '2rem', borderRadius: '16px', borderLeft: '5px solid #66bb6a' }}>
                        <h3 style={{ color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ fontSize: '1.5rem' }}>📋</span> Conditions</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {(t('dl_conditions_list') || []).map((item, i) => (
                                <li key={i} style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}><span>✅</span> {item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* 2. REQUIRED DOCUMENTS */}
            <section style={{ marginBottom: '5rem' }}>
                <h2 style={{ color: '#0d47a1', fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>{t('dl_sec2_title')}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    {(t('dl_docs_list') || []).map((item, i) => (
                        <div key={i} style={{ padding: '1.5rem', background: 'white', border: '1px solid #dcdcdc', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                            <span style={{ fontSize: '1.5rem', color: '#2196f3' }}>📌</span>
                            <p style={{ margin: 0 }}>{item}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. PROCESS */}
            <section style={{ marginBottom: '5rem' }}>
                <h2 style={{ color: '#0d47a1', fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>{t('dl_sec3_title')}</h2>
                <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
                    {(t('dl_steps_list') || []).map((item, i) => (
                        <div key={i} style={{ marginBottom: '2rem', display: 'flex', gap: '1.5rem' }}>
                            <div style={{ background: '#2196f3', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                                {i + 1}
                            </div>
                            <div>
                                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1565c0' }}>{item.title}</h3>
                                <p style={{ margin: 0, color: '#666' }}>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section style={{ textAlign: 'center', background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)', color: 'white', padding: '4rem 2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(21, 101, 192, 0.3)' }}>
                <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', fontWeight: '800' }}>{t('dl_cta_title')}</h2>
                <p style={{ fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem auto', opacity: '0.9' }}>
                    {t('dl_cta_desc')}
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button
                        onClick={() => setShowContactModal(true)}
                        className="btn"
                        style={{
                            background: 'white',
                            color: '#1565c0',
                            fontWeight: '800',
                            padding: '1rem 3rem',
                            fontSize: '1.2rem',
                            border: 'none',
                            borderRadius: '50px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                            cursor: 'pointer',
                            display: 'inline-block',
                            fontFamily: "'Inter', sans-serif"
                        }}
                    >
                        {t('dl_cta_btn')}
                    </button>
                </div>
            </section>
        </div>
    )
}
