'use client'

import React from 'react'
import styles from './FacebookMsg.module.css'

export default function FacebookMsg() {
    const pageId = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || '953279121207440';

    return (
        <a
            href={`https://m.me/${pageId}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.container}
            aria-label="Chat with us on Facebook"
        >
            {/* Messenger Icon SVG */}
            <svg
                viewBox="0 0 28 28"
                fill="white"
                className={styles.icon}
            >
                <path d="M14 0C6.268 0 0 6.007 0 13.414c0 4.02 1.838 7.632 4.8 10.024v5.185c0 .546.666.822 1.054.437l3.228-3.193a14.73 14.73 0 004.918.847c7.732 0 14-6.007 14-13.414S21.732 0 14 0zm1.745 18.056l-3.328-3.55-6.502 3.55 7.155-7.595 3.328 3.55 6.502-3.55-7.155 7.595z" />
            </svg>

            {/* Tooltip text */}
            <span className={styles.tooltip}>
                Chat với chúng tôi
            </span>
        </a>
    )
}
