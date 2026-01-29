import styles from './page.module.css'

export const metadata = {
  title: 'Profitability Audit | Australian Property Marketing',
  description: 'Find out exactly where your marketing money is going. And where it is leaking. The audit traces every marketing dollar through your pipeline.',
}

const included = [
  { title: 'Marketing Spend Analysis', description: 'Every dollar you spend on marketing, mapped and categorised. Where is the money going? What are you actually paying for each lead source?' },
  { title: 'Lead Source Audit', description: 'Which channels generate leads? Which generate appraisals? Which generate listings? The answers are often surprising.' },
  { title: 'Conversion Rate Breakdown', description: 'We trace leads through your entire pipeline: enquiry to contact, contact to appraisal, appraisal to listing. Where are the drop-offs? How big are they?' },
  { title: 'Profit Leak Identification', description: 'The specific points where you are losing potential listings. Not vague observations. Specific problems with specific solutions.' },
  { title: '90-Day Action Plan', description: 'A prioritised roadmap. What to fix first. What to fix second. What will have the biggest impact fastest.' },
  { title: 'Strategy Session', description: '60 minutes with your dedicated strategist to walk through findings and answer every question.' }
]

const process = [
  { step: '1', title: 'Discovery Call', description: '30 minutes. We learn about your agency, your goals, your current marketing, and your frustrations.' },
  { step: '2', title: 'Data Collection', description: 'You give us access to your marketing platforms and CRM. We gather the numbers.' },
  { step: '3', title: 'Analysis', description: 'We trace every lead, calculate every conversion rate, identify every leak.' },
  { step: '4', title: 'Delivery', description: 'You receive a comprehensive audit report. No fluff. Just findings and fixes.' },
  { step: '5', title: 'Strategy Session', description: 'We walk you through everything and answer your questions.' }
]

export default function AuditPage() {
  return (
    <div className={styles.audit}>
      <section className={styles.hero}>
        <div className={styles.heroBg}></div>
        <div className={`${styles.heroContent} container`}>
          <span className={styles.label}>Profitability Audit</span>
          <h1 className={styles.headline}>
            Find Out Exactly Where Your Marketing Money Is Going.
            <span className={styles.headlineAccent}> And Where It Is Leaking.</span>
          </h1>
          <p className={styles.subhead}>
            The Profitability Audit traces every marketing dollar through your pipeline and shows you precisely which investments generate listings and which generate nothing.
          </p>
          <a href="#book" className={styles.cta}>
            Book Your Discovery Call
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </section>

      <section className={styles.problem}>
        <div className="container">
          <h2 className={styles.sectionTitle}>You Cannot Fix What You Cannot See</h2>
          <div className={styles.problemContent}>
            <p>Most agencies have no idea which marketing actually works.</p>
            <p>You might know your cost per lead. But do you know your cost per appraisal? Your cost per listing? Which lead sources convert at 4% and which convert at 0.5%?</p>
            <p>Without these numbers, every marketing decision is a guess.</p>
            <p className={styles.highlight}>The audit gives you the numbers. Then the decisions become obvious.</p>
          </div>
        </div>
      </section>

      <section className={styles.included}>
        <div className="container">
          <h2 className={styles.sectionTitle}>What Is Included</h2>
          <div className={styles.includedGrid}>
            {included.map((item, index) => (
              <div key={index} className={styles.includedItem}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.process}>
        <div className="container">
          <h2 className={styles.sectionTitle}>The Process</h2>
          <div className={styles.processSteps}>
            {process.map((item, index) => (
              <div key={index} className={styles.processStep}>
                <span className={styles.stepNumber}>{item.step}</span>
                <div className={styles.stepContent}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className={styles.timeframe}><strong>Timeframe:</strong> 14 days from start to finish.</p>
        </div>
      </section>

      <section className={styles.investment}>
        <div className="container">
          <div className={styles.investmentCard}>
            <h2>What Our Clients Typically See</h2>
            <div className={styles.price}>
              <span className={styles.priceCurrency}>$</span>
              <span className={styles.priceAmount}>250,000</span>
              <span className={styles.priceGst}>+</span>
            </div>
            <p>Average additional revenue in Year 1. We discuss investment on the discovery call.</p>
            <p className={styles.credit}>Every agency is different. We want to understand your situation before we talk numbers.</p>
          </div>
        </div>
      </section>

      <section className={styles.whoFor}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Who This Is For</h2>
          <ul className={styles.whoList}>
            <li>Independent real estate agencies doing $2M or more in annual GCI.</li>
            <li>Agencies currently spending money on marketing.</li>
            <li>Principals who want to know what is actually working.</li>
            <li>Owners who are tired of reports full of impressions and clicks instead of listings.</li>
          </ul>
        </div>
      </section>

      <section className={styles.booking} id="book">
        <div className="container">
          <div className={styles.bookingCard}>
            <h2>Book Your Discovery Call</h2>
            <p>Fill out the form below to schedule your discovery call.</p>
            <form className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" required />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone</label>
                  <input type="tel" id="phone" name="phone" required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="agency">Agency Name</label>
                  <input type="text" id="agency" name="agency" required />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="agents">Number of Agents</label>
                  <select id="agents" name="agents" required>
                    <option value="">Select...</option>
                    <option value="1-10">1-10</option>
                    <option value="11-20">11-20</option>
                    <option value="21-50">21-50</option>
                    <option value="50+">50+</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="spend">Monthly Marketing Spend</label>
                  <select id="spend" name="spend" required>
                    <option value="">Select...</option>
                    <option value="under-5k">Under $5,000</option>
                    <option value="5k-10k">$5,000 - $10,000</option>
                    <option value="10k-20k">$10,000 - $20,000</option>
                    <option value="20k+">$20,000+</option>
                  </select>
                </div>
              </div>
              <button type="submit" className={styles.submitBtn}>
                Request Discovery Call
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
