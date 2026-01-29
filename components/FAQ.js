'use client'
import { useState, useEffect, useRef } from 'react'
import styles from './FAQ.module.css'

const faqs = [
  { question: "We already have a marketing agency. Why would we need this?", answer: "Ask your current agency one question: How many of the leads you generated last quarter became signed listings? If they cannot answer, or if they change the subject, you have your answer." },
  { question: "We are a franchise. Do you work with franchises?", answer: "We specialise in independent agencies. Franchises have mandated marketing programs that limit what we can do. Independents have more flexibility and more to gain." },
  { question: "What if we just need photography and video?", answer: "We do that too. But great creative without conversion tracking is just expensive content. The real value is knowing what works." },
  { question: "How fast will we see results?", answer: "The audit identifies problems immediately. Most agencies see measurable improvement within 60 to 90 days of implementing the fixes." },
  { question: "What's the investment?", answer: "We discuss that on the discovery call. Every agency is different and we want to understand your situation before we talk numbers. What we can tell you: our average client adds 12 listings and $250K in revenue in their first year working with us." }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
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
    <section className={styles.faq} ref={sectionRef}>
      <div className="container">
        <div className={styles.grid}>
          <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
            <span className="section-label">FAQ</span>
            <h2 className={styles.headline}>Questions Real Agency Principals Ask</h2>
            <p className={styles.subhead}>Direct answers. No corporate waffle.</p>
          </div>

          <div className={`${styles.list} ${isVisible ? styles.visible : ''}`}>
            {faqs.map((faq, index) => (
              <div key={index} className={`${styles.item} ${openIndex === index ? styles.itemOpen : ''}`} style={{ transitionDelay: `${0.1 + index * 0.08}s` }}>
                <button className={styles.question} onClick={() => setOpenIndex(openIndex === index ? null : index)} aria-expanded={openIndex === index}>
                  <span>{faq.question}</span>
                  <span className={styles.icon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                  </span>
                </button>
                <div className={styles.answer}>
                  <div className={styles.answerInner}><p>{faq.answer}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
