'use client'
import { useEffect, useRef, useState } from 'react'
import styles from './Credibility.module.css'

export default function Credibility() {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className={styles.credibility} id="about" ref={sectionRef}>
      <div className="container">
        <div className={styles.grid}>
          <div className={`${styles.visual} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.imageWrap}>
              <div className={styles.image}>
                <div className={styles.imagePlaceholder}>
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>Andy</span>
                  <span className={styles.imageSubtitle}>Founder</span>
                </div>
                <div className={styles.badge}>
                  <span className={styles.badgeNumber}>11+</span>
                  <span className={styles.badgeText}>Years in<br/>Real Estate</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
            <span className="section-label">Why Us</span>
            <h2 className={styles.headline}>Built By Someone Who Has Sat In Your Chair</h2>
            <div className={styles.body}>
              <p>Australian Property Marketing was started by a former real estate agent.</p>
              <p>Not a marketing person who read a book about real estate. Someone who has knocked on doors. Made the cold calls. Lost listings to agents with better marketing. Won listings because the marketing was right.</p>
              <p>We built this company because we got tired of marketing agencies who could not answer a simple question:</p>
              <blockquote className={styles.quote}>How many listings did your work actually generate?</blockquote>
              <p>Now we work with independent agencies who want that answer. And who want to make the number bigger.</p>
              <p>We have sat where you sit. We know the difference between a tyre-kicker and a genuine seller. We know what it costs to lose a listing to an agent with better marketing. That is why we only work with agencies who are serious about fixing the problem.</p>
            </div>
            <div className={styles.signature}>
              <div className={styles.signatureLine}></div>
              <div className={styles.signatureInfo}>
                <span className={styles.signatureName}>Andy</span>
                <span className={styles.signatureTitle}>Founder, Australian Property Marketing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
