import Image from 'next/image'
import styles from '../landing.module.css'

export const metadata = {
  title: 'Real Estate Marketing for Melbourne Agencies | Australian Property Marketing',
  description: 'Melbourne real estate marketing that generates listings, not just leads. The Profitability Audit traces every dollar through your pipeline.',
}

export default function MelbourneLP() {
  return (
    <div className={styles.landing}>
      <header className={styles.header}>
        <Image src="/logo.png" alt="Australian Property Marketing" width={160} height={40} />
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Real Estate Marketing for Melbourne Agencies</h1>
          <p className={styles.subhead}>Melbourne's market demands precision. Your marketing should generate listings, not just leads. We help independent agencies across Melbourne's inner east, bayside, and greater metro convert more leads into signed agency agreements.</p>
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
          <p>"Every marketing agency I have worked with sends me the same report. Impressions. Clicks. Cost per lead. I would ask them: But how many of those leads became listings? They would shrug. These guys are different."</p>
          <footer><strong>Sarah Chen</strong>, Director, Melbourne</footer>
        </blockquote>
      </section>

      <section className={styles.form} id="book">
        <div className={styles.formContent}>
          <h2>Book Your Discovery Call</h2>
          <form>
            <div className={styles.formRow}>
              <input type="text" name="name" placeholder="Your Name" required />
              <input type="email" name="email" placeholder="Email Address" required />
            </div>
            <div className={styles.formRow}>
              <input type="tel" name="phone" placeholder="Phone Number" required />
              <input type="text" name="agency" placeholder="Agency Name" required />
            </div>
            <div className={styles.formRow}>
              <select name="agents" required>
                <option value="">Number of Agents</option>
                <option value="1-10">1-10</option>
                <option value="11-20">11-20</option>
                <option value="21-50">21-50</option>
                <option value="50+">50+</option>
              </select>
              <select name="spend" required>
                <option value="">Monthly Marketing Spend</option>
                <option value="under-5k">Under $5,000</option>
                <option value="5k-10k">$5,000 - $10,000</option>
                <option value="10k-20k">$10,000 - $20,000</option>
                <option value="20k+">$20,000+</option>
              </select>
            </div>
            <input type="hidden" name="location" value="melbourne" />
            <button type="submit" className={styles.submitBtn}>Book Your Discovery Call</button>
          </form>
          <p className={styles.note}>For independent Melbourne agencies doing $2M+ in annual GCI</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>&copy; 2026 Australian Property Marketing. All rights reserved.</p>
      </footer>
    </div>
  )
}
