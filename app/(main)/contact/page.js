import styles from './page.module.css'

export const metadata = {
  title: 'Contact | Australian Property Marketing',
  description: 'Get in touch with Australian Property Marketing. We help independent real estate agencies generate more listings.',
}

export default function ContactPage() {
  return (
    <div className={styles.contact}>
      <section className={styles.hero}>
        <div className={`${styles.heroContent} container`}>
          <span className={styles.label}>Contact</span>
          <h1 className={styles.headline}>Let's Talk About Your Marketing</h1>
          <p className={styles.subhead}>Whether you are ready for an audit or just have questions, we are here to help.</p>
        </div>
      </section>

      <section className={styles.main}>
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.info}>
              <div className={styles.infoBlock}>
                <h3>Phone</h3>
                <a href="tel:1300APMNOW" className={styles.infoLink}>1300 APM NOW</a>
                <p>Monday - Friday, 9am - 5pm AEST</p>
              </div>
              <div className={styles.infoBlock}>
                <h3>Email</h3>
                <a href="mailto:hello@australianpropertymarketing.com.au" className={styles.infoLink}>hello@australianpropertymarketing.com.au</a>
                <p>We respond within 24 hours</p>
              </div>
              <div className={styles.infoBlock}>
                <h3>LinkedIn</h3>
                <a href="https://linkedin.com/company/australian-property-marketing" className={styles.infoLink}>Follow us on LinkedIn</a>
                <p>Industry insights and updates</p>
              </div>
              <div className={styles.audit}>
                <h3>Ready to Talk?</h3>
                <p>If you know you want to move forward, book your discovery call directly.</p>
                <a href="/contact#book" className={styles.auditBtn}>Book Your Discovery Call</a>
              </div>
            </div>

            <div className={styles.formWrap}>
              <h2>Send Us a Message</h2>
              <p>Fill out the form below and we will get back to you within 24 hours.</p>
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
                    <input type="tel" id="phone" name="phone" />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="agency">Agency Name</label>
                    <input type="text" id="agency" name="agency" />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="subject">What can we help with?</label>
                  <select id="subject" name="subject" required>
                    <option value="">Select...</option>
                    <option value="discovery">Discovery Call</option>
                    <option value="retainer">Full Service Retainer</option>
                    <option value="creative">Creative Services</option>
                    <option value="other">General Enquiry</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows="5" required></textarea>
                </div>
                <button type="submit" className={styles.submitBtn}>
                  Send Message
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
