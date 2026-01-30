'use client'

import { useState } from 'react'
import Image from 'next/image'
import andy1 from '@/public/Andy 1.jpeg'
import andy2 from '@/public/Andy 2.jpeg'

export default function AndyPhoto({ className }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', width: '100%', aspectRatio: '4 / 5', borderRadius: '16px', overflow: 'hidden' }}
    >
      <Image
        src={andy1}
        alt="Andy - Founder of Australian Property Marketing"
        fill
        sizes="(max-width: 1024px) 280px, 360px"
        style={{ objectFit: 'cover', objectPosition: 'center top', transition: 'opacity 0.3s ease', opacity: hovered ? 0 : 1 }}
        placeholder="blur"
      />
      <Image
        src={andy2}
        alt=""
        fill
        sizes="(max-width: 1024px) 280px, 360px"
        style={{ objectFit: 'cover', objectPosition: 'center top', transition: 'opacity 0.3s ease', opacity: hovered ? 1 : 0 }}
        placeholder="blur"
      />
    </div>
  )
}
