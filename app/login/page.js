'use client'

import Link from 'next/link'
import styles from '../../components/Auth.module.css'
import { useLanguage } from '../../contexts/LanguageContext'

export default function LoginPage() {
    const { t } = useLanguage()

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>{t('auth_welcome')}</h1>
                <p className={styles.subtitle}>{t('auth_welcome_sub')}</p>

                <form className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">{t('auth_email')}</label>
                        <input
                            type="email"
                            id="email"
                            className={styles.input}
                            placeholder="you@example.com"
                            required
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
                        />
                    </div>
                    <button type="button" className={`btn btn-primary ${styles.submitBtn}`}>
                        {t('auth_signin')}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span className={styles.dividerSpan}>{t('auth_or')}</span>
                </div>

                <button type="button" className="btn btn-secondary" style={{ width: '100%' }}>
                    {t('auth_google')}
                </button>

                <div className={styles.footer}>
                    {t('auth_no_account')} <Link href="/register" className={styles.link}>{t('auth_join')}</Link>
                </div>
            </div>
        </div>
    )
}
