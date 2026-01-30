'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from '../../components/Auth.module.css'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAuth } from '../../contexts/AuthContext'

export default function ForgotPasswordPage() {
    const { t } = useLanguage()
    const { resetPassword } = useAuth()

    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setMessage('')
            setError('')
            setLoading(true)
            await resetPassword(email)
            setMessage(t('auth_reset_email_sent'))
        } catch (err) {
            console.error(err)
            setError('Failed to reset password: ' + err.message)
        }
        setLoading(false)
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>{t('auth_reset_password')}</h1>
                <p className={styles.subtitle}>{t('auth_reset_desc')}</p>

                {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                {message && <div style={{ color: 'green', marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">{t('auth_email')}</label>
                        <input
                            type="email"
                            id="email"
                            className={styles.input}
                            placeholder="you@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
                        {loading ? 'Sending...' : t('auth_send_reset_link')}
                    </button>
                </form>

                <div className={styles.footer}>
                    <Link href="/login" className={styles.link}>{t('auth_back_to_login')}</Link>
                </div>
            </div>
        </div>
    )
}
