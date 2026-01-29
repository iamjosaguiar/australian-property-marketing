import Link from 'next/link'
import styles from './page.module.css'

export const metadata = {
  title: 'Results | Australian Property Marketing',
  description: 'Numbers. Not promises. Real case studies and results from independent real estate agencies across Australia.',
}

const caseStudies = [
  {
    agency: 'Independent agency',
    location: 'Newcastle',
    size: '18 agents',
    problem: 'Spending $14,000 per month on marketing. Leads were coming in but listings were flat. No visibility on what was working.',
    solution: 'Full profitability audit. Discovered 67% of leads received no follow-up after initial contact. Three blind spots in their follow-up system: no response to after-hours enquiries, no second contact attempt for voicemails, no follow-up on partial form submissions.',
    results: ['Appraisals up 40% in 90 days', 'Same marketing spend', '23 additional listings in the first year', 'Estimated additional GCI: $380,000'],
    quote: "We were spending $14,000 a month on marketing. Leads were coming in. But when I sat down with Andy and actually traced those leads through our pipeline, we discovered 67% of them never got a second contact from our team. I have run this agency for 11 years. This is the first time anyone showed me where the money was actually going.",
    person: 'Mark Brennan',
    title: 'Principal'
  },
  {
    agency: 'Independent agency',
    location: 'Melbourne',
    size: '24 agents',
    problem: 'Multiple marketing campaigns running but no visibility on which ones actually generated listings vs just leads.',
    solution: 'Complete lead-to-listing tracking implementation. Built custom reporting dashboards connecting ad spend to signed agency agreements.',
    results: ['Cost per listing dropped 35%', 'Identified 4:1 ROI campaign', 'Eliminated $4,200/month in wasted spend', 'Doubled down on performing channels'],
    quote: "Every marketing agency I have worked with sends me the same report. Impressions. Clicks. Cost per lead. I would ask them: But how many of those leads became listings? They would shrug. These guys are different.",
    person: 'Sarah Chen',
    title: 'Director'
  },
  {
    agency: 'Independent agency',
    location: 'Brisbane',
    size: '15 agents',
    problem: 'Years of wasted marketing spend with no accountability. Low conversion rate of 1.2%.',
    solution: 'Identified $3,200/month in ad spend generating zero appraisals. Rebuilt follow-up system with automated sequences.',
    results: ['Conversion rate: 1.2% → 3.1%', '$3,200/month saved immediately', 'Audit paid for itself in month one', 'System improvements ongoing'],
    quote: "I was sceptical. Really sceptical. I have spent $200,000 on marketing consultants over the years and most of it was wasted on pretty reports and vague recommendations. They found $3,200 a month in ad spend that was generating zero appraisals. Then they rebuilt our follow-up system and our conversion rate went from 1.2% to 3.1% in four months.",
    person: 'David Holloway',
    title: 'Owner'
  }
]

export default function ResultsPage() {
  return (
    <div className={styles.results}>
      <section className={styles.hero}>
        <div className={`${styles.heroContent} container`}>
          <span className={styles.label}>Client Results</span>
          <h1 className={styles.headline}>Numbers. Not Promises.</h1>
          <p className={styles.subhead}>Real case studies from real agency principals. Specific problems. Specific solutions. Measurable results.</p>
        </div>
      </section>

      <section className={styles.studies}>
        <div className="container">
          {caseStudies.map((study, index) => (
            <div key={index} className={styles.study}>
              <div className={styles.studyHeader}>
                <div>
                  <h2>{study.agency}</h2>
                  <p className={styles.studyMeta}>{study.location} · {study.size}</p>
                </div>
              </div>

              <div className={styles.studyGrid}>
                <div className={styles.studySection}>
                  <h3>The Problem</h3>
                  <p>{study.problem}</p>
                </div>
                <div className={styles.studySection}>
                  <h3>What We Did</h3>
                  <p>{study.solution}</p>
                </div>
              </div>

              <div className={styles.studyResults}>
                <h3>Results</h3>
                <ul>
                  {study.results.map((result, i) => (
                    <li key={i}>{result}</li>
                  ))}
                </ul>
              </div>

              <blockquote className={styles.studyQuote}>
                <p>"{study.quote}"</p>
                <footer>
                  <strong>{study.person}</strong>, {study.title}
                </footer>
              </blockquote>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <div className="container">
          <h2>Ready to See Results Like These?</h2>
          <p>Start with a discovery call and find out where your marketing money is actually going.</p>
          <Link href="/contact" className={styles.ctaBtn}>Book Your Discovery Call</Link>
        </div>
      </section>
    </div>
  )
}
