'use client'
import Link from 'next/link'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <div className={styles.gradient}></div>
        <div className={styles.pattern}></div>
      </div>

      <div className={`${styles.content} container`}>
        <div className={`${styles.badge} animate-fade-up`}>
          <span className={styles.badgeDot}></span>
          For independent agencies doing $2M+ in annual GCI
        </div>

        <h1 className={`${styles.headline} animate-fade-up animate-delay-1`}>
          Your Marketing Is Generating Leads.
          <span className={styles.headlineAccent}> Why Isn't It Generating Listings?</span>
        </h1>

        <p className={`${styles.subhead} lead animate-fade-up animate-delay-2`}>
          The average real estate agency converts 1.8% of their leads into listings.
          The other 98.2% disappear somewhere between the first enquiry and the appraisal.
          <strong> We find where they go. Then we fix it.</strong>
        </p>

        <div className={`${styles.actions} animate-fade-up animate-delay-3`}>
          <Link href="/contact" className={`${styles.cta} ${styles.ctaPrimary}`}>
            Book Your Discovery Call
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        <p className={`${styles.resultsLink} animate-fade-up animate-delay-3`}>
          <Link href="/results">See what other principals say →</Link>
        </p>

        <div className={`${styles.stats} animate-fade-up animate-delay-4`}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>40%</span>
            <span className={styles.statLabel}>Avg. increase in appraisals</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>$250K</span>
            <span className={styles.statLabel}>Avg. additional revenue (Year 1)</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>12</span>
            <span className={styles.statLabel}>Extra listings per year</span>
          </div>
        </div>
      </div>
    </section>
  )
}
