'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../utils/translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
    const languages = [
        { code: 'vi', label: '🇻🇳 VN', name: 'Tiếng Việt' },
        { code: 'en', label: '🇬🇧 EN', name: 'English' },
        { code: 'ko', label: '🇰🇷 KO', name: '한국어' },
        { code: 'zh', label: '🇨🇳 ZH', name: '中文' }
    ]

    // Default to Vietnamese ('vi')
    const [language, setLanguage] = useState('vi')

    // Helper function to get translation
    const t = (key) => {
        const keys = key.split('.')
        let value = translations[language]

        for (const k of keys) {
            value = value?.[k]
        }

        return value || key
    }

    const toggleLanguage = () => {
        setLanguage(prev => {
            const currentIndex = languages.findIndex(l => l.code === prev)
            const nextIndex = (currentIndex + 1) % languages.length
            return languages[nextIndex].code
        })
    }

    const value = {
        language,
        setLanguage,
        toggleLanguage,
        t,
        languages
    }

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    return useContext(LanguageContext)
}
