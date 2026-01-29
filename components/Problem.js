'use client'
import { useEffect, useRef, useState } from 'react'
import styles from './Problem.module.css'

export default function Problem() {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className={styles.problem} ref={sectionRef}>
      <div className={`${styles.inner} container`}>
        <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
          <span className="section-label">The Real Problem</span>

          <h2 className={styles.headline}>
            The Problem Is Not Lead Generation.
            <span className={styles.headlineEm}> You Have Plenty of Leads.</span>
          </h2>

          <div className={styles.body}>
            <p>You are spending money on marketing. The leads come in. Your phone rings. Your inbox fills up.</p>
            <p>But somewhere between that first enquiry and a signed agency agreement, most of them vanish.</p>
          </div>

          <div className={styles.insight}>
            <div className={styles.insightHeader}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
              <span>Here is what nobody talks about:</span>
            </div>
            <div className={styles.insightStats}>
              <div className={styles.insightStat}>
                <span className={styles.statOld}>$180</span>
                <span className={styles.statLabel}>Cost per lead<br/>10 years ago</span>
              </div>
              <div className={styles.insightArrow}>
                <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                  <path d="M0 12h36M28 4l8 8-8 8" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className={styles.insightStat}>
                <span className={styles.statNew}>$416</span>
                <span className={styles.statLabel}>Cost per lead<br/>today</span>
              </div>
            </div>
            <div className={styles.insightCost}>
              <span className={styles.insightCostLabel}>100 leads at $416 each = $41,600 spent.</span>
              <span className={styles.insightCostLabel}>At a 2% conversion rate, that is 2 listings.</span>
              <span className={styles.insightCostValue}>$20,800</span>
              <span className={styles.insightCostLabel}>per listing in marketing costs alone.</span>
            </div>
            <p className={styles.insightText}>The leads got more expensive. The conversion rate stayed the same.</p>
            <p className={styles.insightText}>Last month, we audited an agency spending $11,400 on marketing. They had 147 leads. 4 appraisals. 1 listing. That is $11,400 for one listing. We found three gaps in their follow-up process. Same spend. Now they are averaging 6 listings a month.</p>
          </div>

          <div className={styles.conclusion}>
            <p>Most marketing agencies cannot help you fix this. They stop measuring at the click. They celebrate the lead. They never ask what happened next.</p>
            <p className={styles.conclusionStrong}>We do.</p>
          </div>
        </div>

        <div className={`${styles.visual} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.funnel}>
            <div className={`${styles.funnelStage} ${styles.funnelStage1}`}>
              <span className={styles.funnelLabel}>Leads In</span>
              <span className={styles.funnelValue}>100</span>
            </div>
            <div className={styles.funnelLeak}>
              <span>Lost: No follow-up</span>
              <span className={styles.funnelLeakNum}>-34</span>
            </div>
            <div className={`${styles.funnelStage} ${styles.funnelStage2}`}>
              <span className={styles.funnelLabel}>Contacted</span>
              <span className={styles.funnelValue}>66</span>
            </div>
            <div className={styles.funnelLeak}>
              <span>Lost: Poor timing</span>
              <span className={styles.funnelLeakNum}>-41</span>
            </div>
            <div className={`${styles.funnelStage} ${styles.funnelStage3}`}>
              <span className={styles.funnelLabel}>Appraisals</span>
              <span className={styles.funnelValue}>25</span>
            </div>
            <div className={styles.funnelLeak}>
              <span>Lost: Competition</span>
              <span className={styles.funnelLeakNum}>-23</span>
            </div>
            <div className={`${styles.funnelStage} ${styles.funnelStage4}`}>
              <span className={styles.funnelLabel}>Listings</span>
              <span className={styles.funnelValue}>2</span>
            </div>
          </div>
          <p className={styles.visualCaption}>Where 98 of every 100 leads actually go</p>
        </div>
      </div>
    </section>
  )
}
