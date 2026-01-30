import Link from 'next/link'
import { notFound } from 'next/navigation'
import { articles } from '@/lib/articles'
import styles from './page.module.css'

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}

export function generateMetadata({ params }) {
  const article = articles.find((a) => a.slug === params.slug)
  if (!article) return {}
  return {
    title: `${article.title} | Australian Property Marketing`,
    description: article.excerpt,
  }
}

export default function ArticlePage({ params }) {
  const article = articles.find((a) => a.slug === params.slug)
  if (!article) notFound()

  return (
    <div className={styles.article}>
      <article className={styles.content}>
        <div className="container">
          <Link href="/resources" className={styles.back}>← Back to Resources</Link>
          <div className={styles.meta}>
            <span className={styles.category}>{article.category}</span>
            <span className={styles.date}>{article.date}</span>
          </div>
          <h1 className={styles.title}>{article.title}</h1>
          <div className={styles.body}>
            {article.content.map((block, i) => {
              if (block.type === 'h2') return <h2 key={i}>{block.text}</h2>
              return <p key={i}>{block.text}</p>
            })}
          </div>
          <div className={styles.cta}>
            <h3>Want to know your numbers?</h3>
            <p>The Profitability Audit traces every marketing dollar through your pipeline.</p>
            <Link href="/audit" className={styles.ctaBtn}>
              Learn About the Audit
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
