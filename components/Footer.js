'use client'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Image src="/logo.png" alt="Australian Property Marketing" width={160} height={48} className={styles.logo} />
            <p className={styles.tagline}>
              Marketing measured in listings. Not likes.
            </p>
          </div>

          <div className={styles.nav}>
            <div className={styles.navGroup}>
              <h4 className={styles.navTitle}>Services</h4>
              <Link href="/services" className={styles.navLink}>Real Estate Agents</Link>
              <Link href="/services" className={styles.navLink}>Buyers Agents</Link>
              <Link href="/services" className={styles.navLink}>Property Investors</Link>
              <Link href="/services" className={styles.navLink}>Builders</Link>
            </div>

            <div className={styles.navGroup}>
              <h4 className={styles.navTitle}>Company</h4>
              <Link href="/about" className={styles.navLink}>About</Link>
              <Link href="/results" className={styles.navLink}>Results</Link>
              <Link href="/resources" className={styles.navLink}>Resources</Link>
              <Link href="/contact" className={styles.navLink}>Contact</Link>
            </div>

            <div className={styles.navGroup}>
              <h4 className={styles.navTitle}>Contact</h4>
              <a href="mailto:info@australianpropertymarketing.com.au" className={`${styles.navLink} ${styles.highlight}`}>
                info@australianpropertymarketing.com.au
              </a>
              <div className={styles.social}>
                <a href="https://linkedin.com/company/australian-property-marketing" className={styles.socialLink} aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} Australian Property Marketing. All rights reserved.
          </p>
          <div className={styles.legal}>
            <Link href="/privacy" className={styles.legalLink}>Privacy Policy</Link>
            <Link href="/terms" className={styles.legalLink}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
