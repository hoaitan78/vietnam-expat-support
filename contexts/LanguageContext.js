'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../utils/translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
    // Default to Vietnamese ('vi')
    const [language, setLanguage] = useState('vi')

    // Helper function to get translation
    const t = (key) => {
        return translations[language][key] || key
    }

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'vi' ? 'en' : 'vi')
    }

    const value = {
        language,
        setLanguage,
        toggleLanguage,
        t
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
