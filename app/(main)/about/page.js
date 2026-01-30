import AndyPhoto from './AndyPhoto'
import styles from './page.module.css'

export const metadata = {
  title: 'About | Australian Property Marketing',
  description: 'We started this company because we were tired of marketing that did not work. Built by a former real estate agent who understands the business.',
}

export default function AboutPage() {
  return (
    <div className={styles.about}>
      <section className={styles.hero}>
        <div className={`${styles.heroContent} container`}>
          <span className={styles.label}>About Us</span>
          <h1 className={styles.headline}>We Started This Company Because We Were Tired of Marketing That Did Not Work</h1>
        </div>
      </section>

      <section className={styles.story}>
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyImage}>
              <AndyPhoto />
              <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
                <span style={{ fontWeight: 600 }}>Andy</span>
                <span className={styles.imageSubtitle}> — Founder</span>
              </div>
            </div>
            <div className={styles.storyContent}>
              <p>I started my career in real estate.</p>
              <p>I have knocked on doors at 8am on a Saturday. Made 100 cold calls in a day. Lost listings to agents with better marketing and won listings because my marketing was sharper.</p>
              <p>When I started working with marketing agencies, I had one question: <strong>How many listings did your work generate?</strong></p>
              <p>Nobody could answer it.</p>
              <p>They could tell me impressions. Clicks. Leads. They could not tell me the only number that mattered.</p>
              <p>So I built a company that could.</p>
              <p>Australian Property Marketing exists to give agency principals what I always wanted: visibility. Proof. Marketing that is measured by results, not activity.</p>
              <p>If you are tired of pretty reports that do not translate into listings, we should talk.</p>
              <div className={styles.signature}>
                <span className={styles.signatureName}>Andy</span>
                <span className={styles.signatureTitle}>Founder, Australian Property Marketing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.values}>
        <div className="container">
          <h2 className={styles.sectionTitle}>How We Work</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueItem}>
              <h3>Outcomes over activity</h3>
              <p>Listings won. Revenue generated. Return on investment. These are the numbers that matter.</p>
            </div>
            <div className={styles.valueItem}>
              <h3>Transparency</h3>
              <p>You will always know where your money is going. No hidden fees. No inflated reports. No surprises.</p>
            </div>
            <div className={styles.valueItem}>
              <h3>Partnership</h3>
              <p>We work with you, not for you. Your success is our success.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
