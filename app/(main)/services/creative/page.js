import Link from 'next/link'
import styles from '../page.module.css'

export const metadata = {
  title: 'Creative Services | Australian Property Marketing',
  description: 'Professional creative for real estate. Photography, video, drone, and content. Produced in-house. Delivered fast.',
}

const services = [
  { title: 'Photography', description: 'Agent headshots. Team photos. Property photography. Lifestyle and editorial. Consistent quality, consistent style.' },
  { title: 'Video', description: 'Agent profile videos. Agency brand films. Property walkthroughs. Social content. Testimonials.' },
  { title: 'Drone & Aerial', description: 'Aerial photography. Drone video. Suburb flyovers. Licensed and insured operators.' },
  { title: 'Content', description: 'Listing copywriting. Social media management. Email campaigns. Blog content.' }
]

export default function CreativePage() {
  return (
    <div className={styles.services}>
      <section className={styles.hero}>
        <div className={`${styles.heroContent} container`}>
          <span className={styles.label}>Creative Services</span>
          <h1 className={styles.headline}>Professional Creative for Real Estate. Produced In-House. Delivered Fast.</h1>
          <p className={styles.subhead}>Photography, video, and content that helps you win listings. No outsourcing. No delays. No excuses.</p>
        </div>
      </section>

      <section style={{ padding: 'var(--space-2xl) 0', background: 'var(--pure-white)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-xl)', maxWidth: '1000px', margin: '0 auto' }}>
            {services.map((service, index) => (
              <div key={index} style={{ background: 'var(--soft-grey)', padding: 'var(--space-xl)', borderRadius: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: 'var(--space-md)', color: 'var(--charcoal)' }}>{service.title}</h3>
                <p style={{ color: 'var(--charcoal-soft)', lineHeight: 1.7, fontSize: '1.0625rem' }}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--space-2xl) 0', background: 'var(--soft-grey)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: 'var(--space-xl)', color: 'var(--charcoal)', textAlign: 'center' }}>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-lg)', textAlign: 'center' }}>
            {['Brief', 'Quote', 'Shoot', 'Deliver'].map((step, index) => (
              <div key={index}>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '3rem', fontStyle: 'italic', color: 'var(--coral)', opacity: 0.5, marginBottom: '0.5rem' }}>{index + 1}</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--charcoal)' }}>{step}</h3>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 'var(--space-xl)', textAlign: 'center' }}>
            <p style={{ color: 'var(--charcoal-soft)', marginBottom: 'var(--space-sm)' }}><strong>Brief:</strong> Tell us what you need.</p>
            <p style={{ color: 'var(--charcoal-soft)', marginBottom: 'var(--space-sm)' }}><strong>Quote:</strong> Transparent pricing, no surprises.</p>
            <p style={{ color: 'var(--charcoal-soft)', marginBottom: 'var(--space-sm)' }}><strong>Shoot:</strong> We handle production.</p>
            <p style={{ color: 'var(--charcoal-soft)' }}><strong>Deliver:</strong> Fast turnaround, files ready to use.</p>
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--space-3xl) 0', background: 'var(--charcoal)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: 'var(--space-md)', color: 'var(--pure-white)' }}>Need Creative That Converts?</h2>
          <p style={{ color: 'var(--text-on-dark)', fontSize: '1.125rem', marginBottom: 'var(--space-xl)', maxWidth: '500px', margin: '0 auto var(--space-xl)' }}>Tell us what you need. We will send you a quote within 24 hours.</p>
          <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1.125rem 2rem', background: 'var(--coral)', color: 'var(--pure-white)', fontWeight: 600, borderRadius: '8px' }}>
            Get a Quote
          </Link>
        </div>
      </section>
    </div>
  )
}
