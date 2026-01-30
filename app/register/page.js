'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../../components/Auth.module.css'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAuth } from '../../contexts/AuthContext'
import { updateProfile } from 'firebase/auth'

export default function RegisterPage() {
    const { t } = useLanguage()
    const { signup } = useAuth()
    const router = useRouter()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError('')
            setLoading(true)
            const userCredential = await signup(email, password)
            // Update display name
            await updateProfile(userCredential.user, {
                displayName: name
            })
            router.push('/')
        } catch (err) {
            console.error(err)
            setError('Failed to create account: ' + err.message)
        }
        setLoading(false)
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>{t('auth_create')}</h1>
                <p className={styles.subtitle}>{t('auth_create_sub')}</p>

                {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name">{t('auth_name')}</label>
                        <input
                            type="text"
                            id="name"
                            className={styles.input}
                            placeholder="Nguyen Van A"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
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
                            placeholder="Create a password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
                        {loading ? 'Creating...' : t('auth_signup')}
                    </button>
                </form>

                <div className={styles.footer}>
                    {t('auth_has_account')} <Link href="/login" className={styles.link}>{t('auth_login_link')}</Link>
                </div>
            </div>
        </div>
    )
}
