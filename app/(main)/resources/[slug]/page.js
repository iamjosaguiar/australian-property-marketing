import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { articles } from '@/lib/articles'
import { JsonLd, articleSchema, breadcrumbSchema } from '@/lib/schema'
import ShareLinks from './ShareLinks'
import styles from './page.module.css'
import andy1 from '@/public/Andy 1.jpeg'

const BASE_URL = 'https://australianpropertymarketing.com.au'

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const article = articles.find((a) => a.slug === slug)
  if (!article) return {}
  return {
    title: `${article.title} | Australian Property Marketing`,
    description: article.excerpt,
  }
}

export default async function ArticlePage({ params }) {
  const { slug } = await params
  const article = articles.find((a) => a.slug === slug)
  if (!article) notFound()

  const articleUrl = `${BASE_URL}/resources/${slug}`

  return (
    <div className={styles.article}>
      <JsonLd data={[
        articleSchema(article),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Resources', url: '/resources' },
          { name: article.title },
        ]),
      ]} />
      <article className={styles.content}>
        <div className="container">
          <Link href="/resources" className={styles.back}>← Back to Resources</Link>
          <div className={styles.meta}>
            <span className={styles.category}>{article.category}</span>
            <span className={styles.date}>{article.date}</span>
          </div>
          <h1 className={styles.title}>{article.title}</h1>

          <div className={styles.author}>
            <div className={styles.authorPhoto}>
              <Image
                src={andy1}
                alt="Andy"
                width={48}
                height={48}
                className={styles.authorImg}
              />
            </div>
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>Andy</span>
              <span className={styles.authorRole}>Founder, Australian Property Marketing</span>
            </div>
          </div>

          <div className={styles.body}>
            {article.content.map((block, i) => {
              if (block.type === 'h2') return <h2 key={i}>{block.text}</h2>
              return <p key={i}>{block.text}</p>
            })}
          </div>

          <div className={styles.share}>
            <span className={styles.shareLabel}>Share this article</span>
            <ShareLinks url={articleUrl} title={article.title} />
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
