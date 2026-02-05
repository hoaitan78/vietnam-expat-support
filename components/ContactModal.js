'use client'

import styles from './ContactModal.module.css'

export default function ContactModal({ isOpen, onClose }) {
    if (!isOpen) return null

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>×</button>

                <h2 className={styles.title}>Liên hệ hỗ trợ</h2>
                <p className={styles.subtitle}>Chọn phương thức liên hệ phù hợp với bạn</p>

                <div className={styles.options}>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={`${styles.option} ${styles.facebook}`}>
                        <span className={styles.icon}>f</span>
                        <div className={styles.info}>
                            <span className={styles.label}>Chat qua Facebook</span>
                            <span className={styles.subtext}>Hỗ trợ nhanh chóng</span>
                        </div>
                    </a>

                    <a href="tel:0935349897" className={`${styles.option} ${styles.phone}`}>
                        <span className={styles.icon}>📞</span>
                        <div className={styles.info}>
                            <span className={styles.label}>Hotline 1</span>
                            <span className={styles.subtext}>0935 349 897</span>
                        </div>
                    </a>

                    <a href="tel:0798041089" className={`${styles.option} ${styles.phone}`}>
                        <span className={styles.icon}>📞</span>
                        <div className={styles.info}>
                            <span className={styles.label}>Hotline 2</span>
                            <span className={styles.subtext}>0798 041 089</span>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    )
}
