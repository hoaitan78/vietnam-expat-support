export default function GuideSlug({ params }) {
    const isVisa = params.slug === 'visa'

    if (isVisa) {
        return (
            <div className="container" style={{ padding: '4rem 1rem' }}>
                <h1 style={{ color: 'var(--color-primary)', fontSize: '2.5rem', marginBottom: '1rem' }}>Ultimate Vietnam Visa Guide 2024</h1>
                <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '3rem' }}>Everything you need to know about E-visas, exemptions, and extensions.</p>

                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', borderBottom: '2px solid var(--color-secondary)', display: 'inline-block' }}>1. The 90-Day E-Visa</h2>
                    <p style={{ marginBottom: '1rem' }}>As of late 2023, Vietnam offers a <strong>90-day multi-entry E-visa</strong> for citizens of all countries. This is the most common way for expats to enter.</p>
                    <div style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
                        <strong>💡 Pro Tip:</strong> Apply at least 1 week before your trip. The official portal can sometimes glitch or take longer than the stated 3 days.
                    </div>
                </section>

                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Visa Types Comparison</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ background: '#f9f9f9', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem', borderBottom: '2px solid #ddd' }}>Type</th>
                                    <th style={{ padding: '1rem', borderBottom: '2px solid #ddd' }}>Duration</th>
                                    <th style={{ padding: '1rem', borderBottom: '2px solid #ddd' }}>Cost (Approx)</th>
                                    <th style={{ padding: '1rem', borderBottom: '2px solid #ddd' }}>Best For</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}><strong>E-Visa</strong></td>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>30 - 90 Days</td>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>$25 - $50</td>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>Tourists, Digital Nomads</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}><strong>Visa Exemption</strong></td>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>15 - 45 Days</td>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>Free</td>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>Short Trips (Specific Countries)</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}><strong>Business Visa (DN)</strong></td>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>3 Months+</td>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>Variable</td>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>Working with a local entity</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <h2 style={{ marginBottom: '1.5rem' }}>Application Timeline</h2>
                    <div style={{ position: 'relative', paddingLeft: '2rem', borderLeft: '2px solid #eee' }}>
                        <div style={{ marginBottom: '2rem', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-2.45rem', top: '0', background: 'var(--color-secondary)', width: '1rem', height: '1rem', borderRadius: '50%' }}></div>
                            <h3 style={{ margin: 0 }}>Day 1: Submit Application</h3>
                            <p>Go to the official immigration portal. Upload passport photo and page scan.</p>
                        </div>
                        <div style={{ marginBottom: '2rem', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-2.45rem', top: '0', background: 'var(--color-secondary)', width: '1rem', height: '1rem', borderRadius: '50%' }}></div>
                            <h3 style={{ margin: 0 }}>Day 2-3: Processing</h3>
                            <p>Your status will show "In Processing". Do not panic if it takes an extra day.</p>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-2.45rem', top: '0', background: 'var(--color-primary)', width: '1rem', height: '1rem', borderRadius: '50%' }}></div>
                            <h3 style={{ margin: 0 }}>Day 4: Approval</h3>
                            <p>Download your E-visa PDF. Print <strong>two copies</strong> just in case.</p>
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    // Fallback for other slugs
    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <h1>Guide: {params.slug}</h1>
            <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                This is a placeholder for the content of the guide. In a real application, this would fetch markdown content based on the slug.
            </p>
            <article style={{ lineHeight: '1.8' }}>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...</p>
                <p>Detailed information about <strong>{params.slug}</strong> will reside here.</p>
            </article>
        </div>
    )
}
