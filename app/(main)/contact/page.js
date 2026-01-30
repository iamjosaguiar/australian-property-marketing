import ContactForm from './ContactForm'
import styles from './page.module.css'

export const metadata = {
  title: 'Contact | Australian Property Marketing',
  description: 'Get in touch with Australian Property Marketing. We help real estate agencies generate more listings.',
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
                <h3>Email</h3>
                <a href="mailto:info@australianpropertymarketing.com.au" className={styles.infoLink}>info@australianpropertymarketing.com.au</a>
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

            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  )
}
