'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './NotFor.module.css'

export default function NotFor() {
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
    <section className={styles.notFor} ref={sectionRef}>
      <div className="container">
        <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
          <span className={styles.label}>Who This Is Not For</span>
          <p className={styles.intro}>This is probably not for you if:</p>
          <ul className={styles.list}>
            <li>You are happy with your current results</li>
            <li>You want cheap leads, not profitable ones</li>
            <li>You are looking for a set-and-forget solution</li>
            <li>You are not willing to look at the data honestly</li>
          </ul>
          <p className={styles.closer}>Still here? Book your call.</p>
          <Link href="/contact" className={styles.cta}>
            Book Your Discovery Call
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
