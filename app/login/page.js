'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../../components/Auth.module.css'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginPage() {
    const { t } = useLanguage()
    const { login, googleLogin } = useAuth()
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError('')
            setLoading(true)
            await login(email, password)
            router.push('/')
        } catch (err) {
            console.error(err)
            setError('Failed to log in: ' + err.message)
        }
        setLoading(false)
    }

    async function handleGoogleSignIn() {
        try {
            setError('')
            setLoading(true)
            await googleLogin()
            router.push('/')
        } catch (err) {
            console.error(err)
            setError('Failed to google login: ' + err.message)
        }
        setLoading(false)
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>{t('auth_welcome')}</h1>
                <p className={styles.subtitle}>{t('auth_welcome_sub')}</p>

                {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

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
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">{t('auth_password')}</label>
                        <input
                            type="password"
                            id="password"
                            className={styles.input}
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
                        {loading ? 'Logging in...' : t('auth_signin')}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span className={styles.dividerSpan}>{t('auth_or')}</span>
                </div>

                <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ width: '100%' }}
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                >
                    {t('auth_google')}
                </button>

                <div className={styles.footer}>
                    {t('auth_no_account')} <Link href="/register" className={styles.link}>{t('auth_join')}</Link>
                </div>
            </div>
        </div>
    )
}
