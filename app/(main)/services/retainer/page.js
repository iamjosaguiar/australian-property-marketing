import Link from 'next/link'
import styles from '../page.module.css'

export const metadata = {
  title: 'Full Service Retainer | Australian Property Marketing',
  description: 'We take full ownership of your agency\'s marketing. Lead generation. Conversion optimisation. Creative production. Monthly reporting tied to listings.',
}

export default function RetainerPage() {
  return (
    <div className={styles.services}>
      <section className={styles.hero}>
        <div className={`${styles.heroContent} container`}>
          <span className={styles.label}>Full Service Retainer</span>
          <h1 className={styles.headline}>Marketing That Is Managed, Measured, and Accountable to Results</h1>
          <p className={styles.subhead}>We take full ownership of your agency's marketing. Lead generation. Conversion optimisation. Creative production. Monthly reporting tied to one number: listings.</p>
        </div>
      </section>

      <section style={{ padding: 'var(--space-2xl) 0', background: 'var(--pure-white)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-xl)', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ background: 'var(--soft-grey)', padding: 'var(--space-xl)', borderRadius: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 'var(--space-md)', color: 'var(--charcoal)' }}>Lead Generation</h3>
              <p style={{ color: 'var(--charcoal-soft)', lineHeight: 1.7 }}>Google Ads. Facebook and Instagram. Landing pages. Suburb-level targeting. Every campaign built to attract seller enquiries, not tyre-kickers.</p>
            </div>
            <div style={{ background: 'var(--soft-grey)', padding: 'var(--space-xl)', borderRadius: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 'var(--space-md)', color: 'var(--charcoal)' }}>Conversion Systems</h3>
              <p style={{ color: 'var(--charcoal-soft)', lineHeight: 1.7 }}>CRM integration. Follow-up sequences. Pipeline tracking. We build systems that stop leads from falling through the cracks.</p>
            </div>
            <div style={{ background: 'var(--soft-grey)', padding: 'var(--space-xl)', borderRadius: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 'var(--space-md)', color: 'var(--charcoal)' }}>Creative Production</h3>
              <p style={{ color: 'var(--charcoal-soft)', lineHeight: 1.7 }}>Agent photography and video. Property marketing. Social content. Email campaigns. All produced in-house.</p>
            </div>
            <div style={{ background: 'var(--soft-grey)', padding: 'var(--space-xl)', borderRadius: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 'var(--space-md)', color: 'var(--charcoal)' }}>Reporting</h3>
              <p style={{ color: 'var(--charcoal-soft)', lineHeight: 1.7 }}>Monthly performance reviews. Lead-to-listing tracking. ROI analysis. Quarterly strategy sessions. You always know what is working.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--space-2xl) 0', background: 'var(--soft-grey)' }}>
        <div className="container" style={{ maxWidth: '700px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: 'var(--space-lg)', color: 'var(--charcoal)' }}>How It Works</h2>
          <p style={{ color: 'var(--charcoal-soft)', fontSize: '1.125rem', marginBottom: 'var(--space-md)', lineHeight: 1.7 }}>You get a dedicated strategist who knows your agency, your suburbs, and your competitors.</p>
          <p style={{ color: 'var(--charcoal-soft)', fontSize: '1.125rem', marginBottom: 'var(--space-md)', lineHeight: 1.7 }}>We meet monthly to review performance and plan ahead.</p>
          <p style={{ color: 'var(--charcoal-soft)', fontSize: '1.125rem', lineHeight: 1.7 }}>No set-and-forget. No surprise invoices. No disappearing for weeks. We work as an extension of your team, not a vendor you have to chase.</p>
        </div>
      </section>

      <section style={{ padding: 'var(--space-3xl) 0', background: 'var(--charcoal)' }}>
        <div className="container" style={{ maxWidth: '700px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: 'var(--space-lg)', color: 'var(--pure-white)' }}>What Is Included</h2>
          <p style={{ color: 'var(--text-on-dark)', fontSize: '1.125rem', marginBottom: 'var(--space-md)' }}>All retainers include: dedicated strategist, full creative production, monthly reporting, quarterly strategy sessions.</p>
          <p style={{ color: 'var(--text-on-dark)', fontSize: '1rem', marginBottom: 'var(--space-xl)' }}>We discuss scope and investment on the discovery call. Every agency is different.</p>
          <p style={{ color: 'var(--coral)', fontWeight: 600 }}>90-day initial commitment. Month-to-month after that.</p>
        </div>
      </section>

      <section style={{ padding: 'var(--space-2xl) 0', background: 'var(--pure-white)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--charcoal)', lineHeight: 1.5, textAlign: 'center', padding: 'var(--space-xl)', background: 'var(--soft-grey)', borderRadius: '16px', position: 'relative' }}>
            <p style={{ marginBottom: 'var(--space-lg)' }}>"We tried managing marketing in-house. We tried three different agencies. Nothing stuck. These guys have been running our marketing for 18 months now and I have not thought about it once. They just handle it. The numbers show up in my inbox every month and they keep going up. That is all I wanted. Someone competent who actually cares whether it works."</p>
            <footer style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', fontStyle: 'normal' }}>
              <strong>Peter Konstantinos</strong><br/>
              <span style={{ color: 'var(--charcoal-soft)' }}>Principal, Sydney</span>
            </footer>
          </blockquote>
        </div>
      </section>

      <section style={{ padding: 'var(--space-2xl) 0', background: 'var(--soft-grey)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 'var(--space-lg)', color: 'var(--charcoal)' }}>Start With a Discovery Call</h2>
          <p style={{ color: 'var(--charcoal-soft)', fontSize: '1.125rem', marginBottom: 'var(--space-xl)', maxWidth: '600px', margin: '0 auto var(--space-xl)' }}>Before committing to a retainer, understand exactly where your marketing is working and where it is not.</p>
          <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1.125rem 2rem', background: 'var(--coral)', color: 'var(--pure-white)', fontWeight: 600, borderRadius: '8px' }}>
            Book Your Discovery Call
          </Link>
        </div>
      </section>
    </div>
  )
}
