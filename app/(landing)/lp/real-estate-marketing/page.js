import Image from 'next/image'
import LandingForm from '../LandingForm'
import { JsonLd, serviceSchema } from '@/lib/schema'
import styles from '../landing.module.css'

export const metadata = {
  title: 'Real Estate Marketing Audit | Australian Property Marketing',
  description: 'Find out where your marketing money is going. The Profitability Audit traces every dollar through your pipeline.',
}

export default function RealEstateMarketingLP() {
  return (
    <div className={styles.landing}>
      <JsonLd data={serviceSchema({ name: 'Real Estate Marketing Audit', description: 'Find out where your marketing money is going. The Profitability Audit traces every dollar through your pipeline.', url: '/lp/real-estate-marketing' })} />
      <header className={styles.header}>
        <Image src="/logo.png" alt="Australian Property Marketing" width={160} height={40} />
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Your Marketing Is Generating Leads. Why Isn't It Generating Listings?</h1>
          <p className={styles.subhead}>The average agency converts less than 2% of leads into listings. We find where the other 98% are going. Then we fix it.</p>
        </div>
      </section>

      <section className={styles.offer}>
        <div className={styles.offerContent}>
          <h2>What You Get With the Audit</h2>
          <ul className={styles.features}>
            <li><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> Complete marketing spend analysis</li>
            <li><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> Lead source performance breakdown</li>
            <li><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> Conversion rate analysis at every pipeline stage</li>
            <li><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> Specific profit leaks identified</li>
            <li><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> 90-day action plan</li>
          </ul>
          <div className={styles.pricing}>
            <span className={styles.price}>$250K+ <span>avg. Year 1 revenue</span></span>
            <span className={styles.delivery}>Results within 90 days</span>
          </div>
        </div>
      </section>

      <section className={styles.testimonial}>
        <blockquote>
          <p>"I was sceptical. Really sceptical. I have spent $200,000 on marketing consultants over the years and most of it was wasted on pretty reports and vague recommendations. They found $3,200 a month in ad spend generating zero appraisals. Then they rebuilt our follow-up system and our conversion rate went from 1.2% to 3.1% in four months."</p>
          <footer><strong>David Holloway</strong>, Owner, Brisbane</footer>
        </blockquote>
      </section>

      <section className={styles.form} id="book">
        <LandingForm location="real-estate-marketing" note="For agencies doing $2M+ in annual GCI" />
      </section>

      <footer className={styles.footer}>
        <p>&copy; 2026 Australian Property Marketing. All rights reserved.</p>
      </footer>
    </div>
  )
}
