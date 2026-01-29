'use client'
import { useEffect, useRef, useState } from 'react'
import styles from './Testimonials.module.css'

const testimonials = [
  {
    quote: "We were spending $14,000 a month on marketing. Leads were coming in. But when I sat down with Andy and actually traced those leads through our pipeline, we discovered 67% of them never got a second contact from our team. Not because the leads were bad. Because our follow-up system had three blind spots we did not know existed. We fixed those three things. Same marketing spend. Appraisals went up 40% in 90 days. I have run this agency for 11 years. This is the first time anyone showed me where the money was actually going.",
    name: "Mark Brennan", title: "Principal", location: "Newcastle",
    metric: "40%", metricLabel: "More appraisals"
  },
  {
    quote: "Every marketing agency I have worked with sends me the same report. Impressions. Clicks. Cost per lead. I would ask them: But how many of those leads became listings? They would shrug. These guys are different. They gave me a spreadsheet that traced every dollar I spent back to actual signed agency agreements. Turns out one of my campaigns had a 4:1 return and another was burning money. No one had ever shown me that before. We cut the bad one, doubled down on the good one, and our cost per listing dropped 35%.",
    name: "Sarah Chen", title: "Director", location: "Melbourne",
    metric: "35%", metricLabel: "Lower cost per listing"
  },
  {
    quote: "I was sceptical. Really sceptical. I have spent $200,000 on marketing consultants over the years and most of it was wasted on pretty reports and vague recommendations. These guys found $3,200 a month in ad spend that was generating zero appraisals. Zero. Not low return. Zero. Then they rebuilt our follow-up system and our conversion rate went from 1.2% to 3.1% in four months. The maths is simple. Same leads. More listings. More commission.",
    name: "David Holloway", title: "Owner", location: "Brisbane",
    metric: "3.1%", metricLabel: "Conversion rate (was 1.2%)"
  },
  {
    quote: "I rang three marketing agencies before I found these guys. The first two wanted to talk about brand awareness and social engagement. I asked them how they would track actual listings and they changed the subject. Andy spent the first 20 minutes of our call asking me questions about my CRM, my follow-up process, and my conversion rates. He was more interested in my business than in selling me his services. That told me everything I needed to know.",
    name: "Rachel Morrison", title: "Principal", location: "Geelong",
    metric: null, metricLabel: null
  },
  {
    quote: "The thing that surprised me most was how fast we saw results. I expected a six month project with lots of meetings and strategy documents. Instead, they came back in two weeks with five specific problems and five specific fixes. We implemented three of them in the first month. Our appraisal-to-listing ratio went from 52% to 71%. That is not marketing. That is money.",
    name: "James Whitfield", title: "Director", location: "Adelaide",
    metric: "71%", metricLabel: "Appraisal-to-listing (was 52%)"
  }
]

export default function Testimonials() {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className={styles.testimonials} id="results" ref={sectionRef}>
      <div className={styles.bg}></div>
      <div className="container">
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <span className={styles.label}>Client Results</span>
          <p className={styles.socialProof}>Trusted by independent agencies across Australia</p>
          <h2 className={styles.headline}>Numbers. Not Promises.</h2>
          <p className={styles.subhead}>Real results from real agency principals. In their own words.</p>
        </div>

        <div className={`${styles.showcase} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.main}>
            <div className={styles.quoteMark}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 7.05V12H6a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3v-7a5 5 0 0 0-5-5H5v2h1a3 3 0 0 1 3 3v.05z"/>
                <path d="M22 7.05V12h-5a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3v-7a5 5 0 0 0-5-5h-1v2h1a3 3 0 0 1 3 3v.05z"/>
              </svg>
            </div>
            <blockquote className={styles.quote}>{testimonials[activeIndex].quote}</blockquote>
            <div className={styles.author}>
              <div className={styles.authorAvatar}>
                {testimonials[activeIndex].name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>{testimonials[activeIndex].name}</span>
                <span className={styles.authorTitle}>{testimonials[activeIndex].title}, {testimonials[activeIndex].location}</span>
              </div>
              {testimonials[activeIndex].metric && (
                <div className={styles.authorMetric}>
                  <span className={styles.metricValue}>{testimonials[activeIndex].metric}</span>
                  <span className={styles.metricLabel}>{testimonials[activeIndex].metricLabel}</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.nav}>
            {testimonials.map((t, index) => (
              <button key={index} className={`${styles.navBtn} ${activeIndex === index ? styles.active : ''}`} onClick={() => setActiveIndex(index)}>
                <span className={styles.navName}>{t.name}</span>
                <span className={styles.navCompany}>{t.location}</span>
                {t.metric && <span className={styles.navMetric}>{t.metric}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
