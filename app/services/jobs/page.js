'use client'

import { useLanguage } from '../../../contexts/LanguageContext'
import Link from 'next/link'
import styles from './page.module.css'

export default function JobsPage() {
    const { t } = useLanguage()

    const jobs = [
        {
            id: 1,
            title: "English Teacher",
            company: "Ocean Blue Language Center",
            salary: "$20/hr",
            location: "Nha Trang City Center",
            type: "Part-time",
            tags: ["Teaching", "English", "Native Speaker"],
            posted: "2 days ago"
        },
        {
            id: 2,
            title: "Digital Nomad Community Manager",
            company: "CoWork Nha Trang",
            salary: "$1200/month",
            location: "Tan Lap, Nha Trang",
            type: "Full-time",
            tags: ["Community", "Management", "Events"],
            posted: "1 day ago"
        },
        {
            id: 3,
            title: "Hotel Front Desk Agent",
            company: "Sunrise Beach Resort",
            salary: "$600 - $800/month",
            location: "Tran Phu, Nha Trang",
            type: "Full-time",
            tags: ["Hospitality", "Customer Service"],
            posted: "5 days ago"
        },
        {
            id: 4,
            title: "Marketing Specialist",
            company: "Local Tour Operator",
            salary: "$900/month",
            location: "Vinh Nguyen, Nha Trang",
            type: "Remote / Hybrid",
            tags: ["Marketing", "Tourism", "Social Media"],
            posted: "1 week ago"
        },
        {
            id: 5,
            title: "Yoga Instructor",
            company: "Wellness Studio",
            salary: "$25/class",
            location: "An Vien, Nha Trang",
            type: "Freelance",
            tags: ["Fitness", "Health", "Yoga"],
            posted: "3 days ago"
        },
        {
            id: 6,
            title: "Remote Software Developer",
            company: "Global Tech Inc (Hiring in VN)",
            salary: "$2500 - $4000/month",
            location: "Remote (Nha Trang based)",
            type: "Full-time",
            tags: ["Tech", "Software", "Remote"],
            posted: "Just now"
        }
    ]

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div className={styles.header}>
                <h1 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>{t('jobs_title')}</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                    {t('jobs_subtitle')}
                </p>
            </div>

            <div className={styles.jobList}>
                {(t('jobs_list') || []).map((job) => (
                    <div key={job.id} className={styles.jobCard}>
                        <div className={styles.mainInfo}>
                            <h3 className={styles.jobTitle}>{job.title}</h3>
                            <p className={styles.company}>{job.company}</p>
                            <div className={styles.meta}>
                                <span className={styles.salary}>{t('job_salary')} {job.salary}</span>
                                <span className={styles.location}>📍 {t('job_location')} {job.location}</span>
                                <span className={styles.type}>🕒 {t('job_type')} {job.type}</span>
                            </div>
                        </div>
                        <div className={styles.sideInfo}>
                            <div className={styles.tags}>
                                {job.tags.map((tag, i) => (
                                    <span key={i} className={styles.tag}>{tag}</span>
                                ))}
                            </div>
                            <span className={styles.posted}>{t('job_posted')} {job.posted}</span>
                            <button className="btn btn-primary btn-sm">{t('jobs_apply')}</button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <Link href="/services" className="btn btn-secondary">
                    {t('jobs_back')}
                </Link>
            </div>
        </div>
    )
}
