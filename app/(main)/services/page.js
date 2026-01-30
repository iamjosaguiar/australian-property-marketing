import Link from 'next/link'
import { JsonLd, serviceSchema, breadcrumbSchema } from '@/lib/schema'
import styles from './page.module.css'

export const metadata = {
  title: 'Services | Australian Property Marketing',
  description: 'Marketing services for real estate agents, buyers agents, property investors, and builders across Australia.',
}

const servicesSchemas = [
  serviceSchema({ name: 'Real Estate Agent Marketing', description: 'Lead generation that targets genuine sellers. Conversion systems that stop leads falling through the cracks. Creative that positions you as the obvious choice.', url: '/services' }),
  serviceSchema({ name: 'Buyers Agent Marketing', description: 'Campaigns that attract serious buyers with capital ready to deploy. No tyre-kickers. Just qualified leads who need your expertise.', url: '/services' }),
  serviceSchema({ name: 'Property Investor Marketing', description: 'Targeted campaigns that reach investors at the right moment. Lead qualification that filters out the curious from the committed.', url: '/services' }),
  serviceSchema({ name: 'Builder Marketing', description: 'Generate leads from people who have land, finance, and intent. Your sales team spends less time qualifying and more time closing.', url: '/services' }),
]

const verticals = [
  {
    title: 'Real Estate Agents',
    headline: 'Marketing That Wins Listings',
    copy: 'You are competing against agents with bigger budgets and better brand recognition. We level the playing field. Lead generation that targets genuine sellers. Conversion systems that stop leads falling through the cracks. Creative that positions you as the obvious choice.',
    subtext: 'For agents and boutique agencies who want more listings without wasting money on marketing that does not convert.',
  },
  {
    title: 'Buyers Agents',
    headline: 'Attract Qualified Buyers Ready to Act',
    copy: 'Your clients are not browsing. They are ready to buy and they need someone who can find what the market cannot. We build campaigns that attract serious buyers with capital ready to deploy. No tyre-kickers. No dreamers. Just qualified leads who need your expertise.',
    subtext: 'For buyers agents who want a consistent pipeline of high-intent clients.',
  },
  {
    title: 'Property Investors',
    headline: 'Connect With Investors Actively Looking',
    copy: 'Property investors are researching online before they ever pick up the phone. We make sure they find you first. Targeted campaigns that reach investors at the right moment. Lead qualification that filters out the curious from the committed.',
    subtext: 'For agencies and advisors who serve the investor market and want higher quality leads.',
  },
  {
    title: 'Builders',
    headline: 'Fill Your Pipeline With Build-Ready Clients',
    copy: 'Every quote you write for someone who is not serious costs you time and money. We generate leads from people who have land, finance, and intent. Your sales team spends less time qualifying and more time closing.',
    subtext: 'For builders and construction companies who want leads that convert to contracts.',
  }
]

export default function ServicesPage() {
  return (
    <div className={styles.services}>
      <JsonLd data={[
        ...servicesSchemas,
        breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Services' }]),
      ]} />
      <section className={styles.hero}>
        <div className={`${styles.heroContent} container`}>
          <span className={styles.label}>Our Services</span>
          <h1 className={styles.headline}>Marketing That Generates Listings</h1>
          <p className={styles.subhead}>Everything you need to attract, convert, and win more listings. All measured. All accountable.</p>
        </div>
      </section>

      <section className={styles.grid}>
        <div className="container">
          <div className={styles.serviceCards}>
            {verticals.map((vertical, index) => (
              <div key={index} className={styles.serviceCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.verticalLabel}>{vertical.title}</span>
                  <h2>{vertical.headline}</h2>
                </div>
                <p className={styles.cardDesc}>{vertical.copy}</p>
                <p className={styles.cardSubtext}>{vertical.subtext}</p>
                <Link href="/contact" className={styles.cardCta}>Book Your Discovery Call</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.process}>
        <div className="container">
          <h2 className={styles.sectionTitle}>How We Work</h2>
          <div className={styles.processGrid}>
            <div className={styles.processItem}>
              <span className={styles.processNum}>01</span>
              <h3>Outcomes over activity</h3>
              <p>Listings won. Revenue generated. Return on investment. These are the numbers that matter.</p>
            </div>
            <div className={styles.processItem}>
              <span className={styles.processNum}>02</span>
              <h3>Transparency</h3>
              <p>You will always know where your money is going. No hidden fees. No inflated reports. No surprises.</p>
            </div>
            <div className={styles.processItem}>
              <span className={styles.processNum}>03</span>
              <h3>Partnership</h3>
              <p>We work with you, not for you. Your success is our success.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
