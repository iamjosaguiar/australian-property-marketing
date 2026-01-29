'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './Offer.module.css'

const included = [
  { title: 'Marketing Spend Analysis', description: 'Every dollar you spend on marketing, mapped and categorised.' },
  { title: 'Lead Source Audit', description: 'Which channels generate leads, appraisals, and actual listings.' },
  { title: 'Conversion Rate Breakdown', description: 'Your pipeline traced from enquiry to signed agreement.' },
  { title: 'Profit Leak Identification', description: 'Specific problems with specific solutions. No vague observations.' },
  { title: '90-Day Action Plan', description: 'A prioritised roadmap. What to fix first for maximum impact.' },
  { title: 'Strategy Session', description: '60 minutes to walk through findings and answer every question.' }
]

export default function Offer() {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className={styles.offer} id="audit" ref={sectionRef}>
      <div className="container">
        <div className={styles.grid}>
          <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
            <span className="section-label">The Offer</span>
            <h2 className={styles.headline}>Start With a Discovery Call</h2>
            <p className={styles.intro}>Before we work together, we show you exactly where your marketing money is going. And where it is leaking.</p>

            <div className={styles.included}>
              <h3 className={styles.includedTitle}>What you get:</h3>
              <ul className={styles.includedList}>
                {included.map((item, index) => (
                  <li key={index} className={styles.includedItem} style={{ transitionDelay: `${0.3 + index * 0.08}s` }}>
                    <span className={styles.includedCheck}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    <div className={styles.includedText}>
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={`${styles.card} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.cardInner}>
              <div className={styles.cardHeader}>
                <span className={styles.cardLabel}>What Our Clients Typically See</span>
                <div className={styles.cardPrice}>
                  <span className={styles.cardCurrency}>$</span>
                  <span className={styles.cardAmount}>250,000</span>
                  <span className={styles.cardGst}>+</span>
                </div>
                <p className={styles.cardSubtitle}>Average additional revenue in Year 1</p>
              </div>
              <div className={styles.cardDetails}>
                <div className={styles.cardDetail}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  <span><strong>12</strong> extra listings per year (average)</span>
                </div>
                <div className={styles.cardDetail}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Results within <strong>90 days</strong></span>
                </div>
                <div className={styles.cardDetail}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Only <strong>5</strong> discovery calls per month</span>
                </div>
              </div>
              <Link href="/contact" className={styles.cardCta}>
                Book Your Discovery Call
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <p className={styles.cardNote}>No pitch. No pressure. Just a straight conversation about whether we can help. If we cannot, we will tell you.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
