'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './Solution.module.css'

const pillars = [
  {
    number: '01',
    title: 'Lead Generation That Targets Sellers',
    description: 'Buyer leads are easy to generate and worthless to an agency. We build campaigns that attract genuine listing opportunities in your core suburbs. Every dollar traceable to source.',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>
  },
  {
    number: '02',
    title: 'Conversion Systems That Stop the Leaks',
    description: 'We audit your entire pipeline from first contact to signed agreement. Where are leads dropping off? Why? What does it cost you? Then we fix the holes.',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
  },
  {
    number: '03',
    title: 'Creative That Actually Converts',
    description: 'Photography. Video. Agent profiles. Property campaigns. All produced in-house, on-brand, and designed to do one thing: win the listing.',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
  }
]

export default function Solution() {
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
    <section className={styles.solution} id="services" ref={sectionRef}>
      <div className={styles.bg}></div>
      <div className="container">
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <span className="section-label">Our Approach</span>
          <h2 className={styles.headline}>
            Marketing Measured in Listings.
            <span className={styles.headlineAccent}> Not Likes.</span>
          </h2>
        </div>

        <div className={styles.pillars}>
          {pillars.map((pillar, index) => (
            <div key={pillar.number} className={`${styles.pillar} ${isVisible ? styles.visible : ''}`} style={{ transitionDelay: `${0.1 + index * 0.15}s` }}>
              <div className={styles.pillarNumber}>{pillar.number}</div>
              <div className={styles.pillarIcon}>{pillar.icon}</div>
              <h3 className={styles.pillarTitle}>{pillar.title}</h3>
              <p className={styles.pillarDesc}>{pillar.description}</p>
            </div>
          ))}
        </div>

        <div className={`${styles.ctaWrap} ${isVisible ? styles.visible : ''}`}>
          <Link href="/contact" className={styles.cta}>
            Book Your Discovery Call
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
