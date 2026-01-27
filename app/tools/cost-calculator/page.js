'use client'

import { useState, useMemo } from 'react'
import styles from './page.module.css'
import { useLanguage } from '../../../contexts/LanguageContext'

export default function CostCalculator() {
    const { t } = useLanguage()
    const [housing, setHousing] = useState('apartment')
    const [eating, setEating] = useState(2)
    const [transport, setTransport] = useState('motorbike')
    const [lifestyle, setLifestyle] = useState('moderate')

    // Base costs in USD
    const costs = useMemo(() => {
        let total = 0
        let breakdown = { housing: 0, food: 0, transport: 0, leisure: 0 }

        if (housing === 'shared') breakdown.housing = 250
        if (housing === 'apartment') breakdown.housing = 550
        if (housing === 'house') breakdown.housing = 1000

        breakdown.food = 150 + (eating * 150)

        if (transport === 'bus') breakdown.transport = 10
        if (transport === 'motorbike') breakdown.transport = 50
        if (transport === 'taxi') breakdown.transport = 200

        if (lifestyle === 'frugal') breakdown.leisure = 50
        if (lifestyle === 'moderate') breakdown.leisure = 200
        if (lifestyle === 'active') breakdown.leisure = 500

        total = Object.values(breakdown).reduce((a, b) => a + b, 0)
        return { total, breakdown }
    }, [housing, eating, transport, lifestyle])

    return (
        <div className={styles.container}>
            <div className={styles.intro}>
                <h1 className={styles.title}>{t('calc_title')}</h1>
                <p>{t('calc_intro')}</p>
            </div>

            <div className={styles.grid}>
                <div className={styles.formCard}>
                    <div className={styles.control}>
                        <label className={styles.label}>{t('calc_housing')}</label>
                        <select className={styles.select} value={housing} onChange={e => setHousing(e.target.value)}>
                            <option value="shared">{t('calc_housing_shared')}</option>
                            <option value="apartment">{t('calc_housing_apt')}</option>
                            <option value="house">{t('calc_housing_house')}</option>
                        </select>
                    </div>

                    <div className={styles.control}>
                        <label className={styles.label}>{t('calc_food')}</label>
                        <input
                            type="range"
                            className={styles.range}
                            min="0" max="3" step="1"
                            value={eating}
                            onChange={e => setEating(Number(e.target.value))}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '0.5rem', color: '#666' }}>
                            <span>{t('calc_food_rare')}</span>
                            <span>{t('calc_food_daily')}</span>
                        </div>
                    </div>

                    <div className={styles.control}>
                        <label className={styles.label}>{t('calc_transport')}</label>
                        <select className={styles.select} value={transport} onChange={e => setTransport(e.target.value)}>
                            <option value="bus">{t('calc_transport_bus')}</option>
                            <option value="motorbike">{t('calc_transport_bike')}</option>
                            <option value="taxi">{t('calc_transport_taxi')}</option>
                        </select>
                    </div>

                    <div className={styles.control}>
                        <label className={styles.label}>{t('calc_lifestyle')}</label>
                        <select className={styles.select} value={lifestyle} onChange={e => setLifestyle(e.target.value)}>
                            <option value="frugal">{t('calc_lifestyle_frugal')}</option>
                            <option value="moderate">{t('calc_lifestyle_mod')}</option>
                            <option value="active">{t('calc_lifestyle_active')}</option>
                        </select>
                    </div>
                </div>

                <div className={styles.resultCard}>
                    <div className={styles.resultTitle}>{t('calc_total')}</div>
                    <div className={styles.total}>${costs.total}</div>
                    <span className={styles.currency}>{t('calc_currency')}</span>

                    <div style={{ marginTop: '2rem' }}>
                        <div className={styles.breakdownItem}>
                            <span>{t('calc_res_housing')}</span>
                            <b>${costs.breakdown.housing}</b>
                        </div>
                        <div className={styles.breakdownItem}>
                            <span>{t('calc_res_food')}</span>
                            <b>${costs.breakdown.food}</b>
                        </div>
                        <div className={styles.breakdownItem}>
                            <span>{t('calc_res_transport')}</span>
                            <b>${costs.breakdown.transport}</b>
                        </div>
                        <div className={styles.breakdownItem}>
                            <span>{t('calc_res_leisure')}</span>
                            <b>${costs.breakdown.leisure}</b>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
