'use client'

import Link from 'next/link'
import styles from '../../components/Auth.module.css'
import { useLanguage } from '../../contexts/LanguageContext'

export default function RegisterPage() {
    const { t } = useLanguage()

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>{t('auth_create')}</h1>
                <p className={styles.subtitle}>{t('auth_create_sub')}</p>

                <form className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name">{t('auth_name')}</label>
                        <input
                            type="text"
                            id="name"
                            className={styles.input}
                            placeholder="Nguyen Van A"
                            required
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
                        />
                    </div>
                    <button type="button" className={`btn btn-primary ${styles.submitBtn}`}>
                        {t('auth_signup')}
                    </button>
                </form>

                <div className={styles.footer}>
                    {t('auth_has_account')} <Link href="/login" className={styles.link}>{t('auth_login_link')}</Link>
                </div>
            </div>
        </div>
    )
}
