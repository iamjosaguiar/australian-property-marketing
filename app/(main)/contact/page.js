import ContactForm from './ContactForm'
import { JsonLd, breadcrumbSchema } from '@/lib/schema'
import styles from './page.module.css'

export const metadata = {
  title: 'Contact | Australian Property Marketing',
  description: 'Get in touch with Australian Property Marketing. We help real estate agencies generate more listings.',
}

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Australian Property Marketing',
  description: 'Get in touch with Australian Property Marketing. We help real estate agencies generate more listings.',
  mainEntity: {
    '@type': 'MarketingAgency',
    name: 'Australian Property Marketing',
    email: 'info@australianpropertymarketing.com.au',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@australianpropertymarketing.com.au',
      contactType: 'sales',
      availableLanguage: 'English',
    },
  },
}

export default function ContactPage() {
  return (
    <div className={styles.contact}>
      <JsonLd data={[
        contactSchema,
        breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Contact' }]),
      ]} />
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
                <h3>Follow Us</h3>
                <a href="https://facebook.com/australianpropertymarketing" className={styles.infoLink}>Facebook</a>
                <a href="https://instagram.com/australianpropertymarketing" className={styles.infoLink}>Instagram</a>
                <a href="https://linkedin.com/company/australian-property-marketing" className={styles.infoLink}>LinkedIn</a>
                <a href="https://youtube.com/@australianpropertymarketing" className={styles.infoLink}>YouTube</a>
                <a href="https://x.com/auspropmktg" className={styles.infoLink}>X</a>
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
