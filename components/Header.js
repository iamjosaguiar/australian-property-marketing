'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Header.module.css'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          <Link href="/" className={styles.logo}>
            <Image src="/logo.png" alt="Australian Property Marketing" width={180} height={44} priority />
          </Link>

          <nav className={`${styles.desktopNav}`}>
            <Link href="/about" className={styles.link}>About</Link>
            <Link href="/services" className={styles.link}>Services</Link>
            <Link href="/results" className={styles.link}>Results</Link>
            <Link href="/resources" className={styles.link}>Resources</Link>
            <Link href="/contact" className={styles.link}>Contact</Link>
            <a href="mailto:info@australianpropertymarketing.com.au" className={styles.phone}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              info@apm.com.au
            </a>
          </nav>

          <Link href="/contact" className={styles.cta}>
            Book Your Discovery Call
          </Link>

          <button
            className={`${styles.menuToggle} ${menuOpen ? styles.active : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <nav className={`${styles.mobileNav} ${menuOpen ? styles.navOpen : ''}`}>
        <Link href="/about" className={styles.link} onClick={() => setMenuOpen(false)}>About</Link>
        <Link href="/services" className={styles.link} onClick={() => setMenuOpen(false)}>Services</Link>
        <Link href="/results" className={styles.link} onClick={() => setMenuOpen(false)}>Results</Link>
        <Link href="/resources" className={styles.link} onClick={() => setMenuOpen(false)}>Resources</Link>
        <Link href="/contact" className={styles.link} onClick={() => setMenuOpen(false)}>Contact</Link>
        <a href="mailto:info@australianpropertymarketing.com.au" className={styles.mobilePhone}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
          </svg>
          info@apm.com.au
        </a>
      </nav>
    </>
  )
}
