import Link from 'next/link'
import NewsletterForm from './NewsletterForm'
import { articles } from '@/lib/articles'
import styles from './page.module.css'

export const metadata = {
  title: 'Resources | Australian Property Marketing',
  description: 'Insights and resources for real estate agency principals. Marketing strategies, conversion tips, and industry analysis.',
}

export default function ResourcesPage() {
  return (
    <div className={styles.resources}>
      <section className={styles.hero}>
        <div className={`${styles.heroContent} container`}>
          <span className={styles.label}>Resources</span>
          <h1 className={styles.headline}>Insights for Agency Principals</h1>
          <p className={styles.subhead}>Practical strategies for generating and converting more listings. No fluff. No generic advice.</p>
        </div>
      </section>

      <section className={styles.articles}>
        <div className="container">
          <div className={styles.articleGrid}>
            {articles.map((article) => (
              <Link key={article.slug} href={`/resources/${article.slug}`} className={styles.articleLink}>
                <article className={styles.article}>
                  <div className={styles.articleMeta}>
                    <span className={styles.category}>{article.category}</span>
                    <span className={styles.date}>{article.date}</span>
                  </div>
                  <h2>{article.title}</h2>
                  <p>{article.excerpt}</p>
                  <span className={styles.readMore}>Read Article →</span>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.newsletter}>
        <div className="container">
          <NewsletterForm />
        </div>
      </section>
    </div>
  )
}
