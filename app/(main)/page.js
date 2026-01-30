import Hero from '@/components/Hero'
import Problem from '@/components/Problem'
import Solution from '@/components/Solution'
import Credibility from '@/components/Credibility'
import Testimonials from '@/components/Testimonials'
import Offer from '@/components/Offer'
import FAQ from '@/components/FAQ'
import NotFor from '@/components/NotFor'
import FinalCTA from '@/components/FinalCTA'
import { JsonLd, faqSchema, breadcrumbSchema } from '@/lib/schema'

const homeFaqs = [
  { question: "We already have a marketing agency. Why would we need this?", answer: "Ask your current agency one question: How many of the leads you generated last quarter became signed listings? If they cannot answer, or if they change the subject, you have your answer." },
  { question: "We are a franchise. Do you work with franchises?", answer: "We work with agencies of all types. Franchises sometimes have mandated marketing programs that limit what we can do, but we are happy to discuss your situation." },
  { question: "What if we just need photography and video?", answer: "We do that too. But great creative without conversion tracking is just expensive content. The real value is knowing what works." },
  { question: "How fast will we see results?", answer: "The audit identifies problems immediately. Most agencies see measurable improvement within 60 to 90 days of implementing the fixes." },
  { question: "What's the investment?", answer: "We discuss that on the discovery call. Every agency is different and we want to understand your situation before we talk numbers. What we can tell you: our average client adds 12 listings and $250K in revenue in their first year working with us." },
]

export default function Home() {
  return (
    <>
      <JsonLd data={[
        faqSchema(homeFaqs),
        breadcrumbSchema([{ name: 'Home' }]),
      ]} />
      <Hero />
      <Problem />
      <Solution />
      <Credibility />
      <Testimonials />
      <Offer />
      <FAQ />
      <NotFor />
      <FinalCTA />
    </>
  )
}
