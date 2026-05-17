'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useStreak } from '@/lib/store'
import s from './TopNav.module.scss'

export function TopNav() {
  const path = usePathname()
  const streak = useStreak()

  return (
    <nav className={s.nav}>
      <Link href="/" className={s.brand}>
        <span className={s.glyph}>&gt;_</span>
        <span className={s.word}>TRACE</span>
      </Link>

      <div className={s.links}>
        <Link href="/" className={`${s.link} ${path === '/' ? s.on : ''}`}>
          Home
        </Link>
        <Link
          href="/patterns"
          className={`${s.link} ${path.startsWith('/pattern') ? s.on : ''}`}
        >
          Patterns
        </Link>
        <Link href="/practice" className={`${s.link} ${path.startsWith('/practice') ? s.on : ''}`}>
          Practice
        </Link>
      </div>

      <span className={s.spacer} />

      <div className={`${s.streak} ${streak === 0 ? s.cold : ''}`}>
        <span className={s.dot} />
        {streak === 0 ? 'no streak yet' : `${streak}d streak`}
      </div>
    </nav>
  )
}
