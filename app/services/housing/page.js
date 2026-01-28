'use client'

import { useLanguage } from '../../../contexts/LanguageContext'
import Link from 'next/link'
import styles from './page.module.css'

export default function HousingPage() {
    const { t } = useLanguage()

    const houses = [
        {
            id: 1,
            title: "Modern Sea View Apartment",
            price: "$550/month",
            location: "Vinh Hoa, Nha Trang",
            beds: 2,
            baths: 2,
            image: "https://placehold.co/600x400/1A4D2E/FFFFFF?text=Sea+View+Apartment"
        },
        {
            id: 2,
            title: "Cozy Studio Near Beach",
            price: "$350/month",
            location: "Loc Tho, Nha Trang",
            beds: 1,
            baths: 1,
            image: "https://placehold.co/600x400/E8F5E9/1A4D2E?text=Cozy+Studio"
        },
        {
            id: 3,
            title: "Luxury Villa with Pool",
            price: "$1200/month",
            location: "An Vien, Nha Trang",
            beds: 4,
            baths: 3,
            image: "https://placehold.co/600x400/1A4D2E/FFFFFF?text=Luxury+Villa"
        },
        {
            id: 4,
            title: "City Center Condo",
            price: "$450/month",
            location: "Phuoc Hai, Nha Trang",
            beds: 2,
            baths: 1,
            image: "https://placehold.co/600x400/E8F5E9/1A4D2E?text=City+Condo"
        },
        {
            id: 5,
            title: "Traditional House",
            price: "$300/month",
            location: "Vinh Hai, Nha Trang",
            beds: 2,
            baths: 1,
            image: "https://placehold.co/600x400/1A4D2E/FFFFFF?text=Traditional+House"
        },
        {
            id: 6,
            title: "Beachfront Penthouse",
            price: "$900/month",
            location: "Tran Phu, Nha Trang",
            beds: 3,
            baths: 2,
            image: "https://placehold.co/600x400/E8F5E9/1A4D2E?text=Penthouse"
        }
    ]

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h1 style={{ marginBottom: '2rem', color: 'var(--color-primary)' }}>Find Your Home in Nha Trang</h1>

            <div className={styles.grid}>
                {houses.map(house => (
                    <div key={house.id} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            <img src={house.image} alt={house.title} className={styles.image} />
                            <span className={styles.price}>{house.price}</span>
                        </div>
                        <div className={styles.content}>
                            <h3 className={styles.title}>{house.title}</h3>
                            <p className={styles.location}>📍 {house.location}</p>
                            <div className={styles.details}>
                                <span>🛏️ {house.beds} Beds</span>
                                <span>🚿 {house.baths} Baths</span>
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <Link href="/services" className="btn btn-secondary">
                    ← Back to Services
                </Link>
            </div>
        </div>
    )
}
