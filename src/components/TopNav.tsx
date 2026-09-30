'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useStreak } from '@/lib/store'
import s from './TopNav.module.scss'

const LINKS: { href: string; label: string; active: (path: string) => boolean }[] = [
  { href: '/', label: 'Home', active: (p) => p === '/' },
  { href: '/patterns', label: 'Patterns', active: (p) => p.startsWith('/pattern') },
  { href: '/practice', label: 'Blind 75', active: (p) => p.startsWith('/practice') },
  { href: '/sde', label: 'SDE Sheet', active: (p) => p.startsWith('/sde') },
  { href: '/premium', label: 'Premium', active: (p) => p.startsWith('/premium') },
  { href: '/company/google', label: 'Google', active: (p) => p.startsWith('/company') },
]

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
        {LINKS.map(({ href, label, active }) => {
          const on = active(path)
          return (
            <Link
              key={href}
              href={href}
              className={`${s.link} ${on ? s.on : ''}`}
              aria-current={on ? 'page' : undefined}
            >
              {label}
            </Link>
          )
        })}
      </div>

      <span className={s.spacer} />

      <div className={`${s.streak} ${streak === 0 ? s.cold : ''}`}>
        <span className={s.dot} />
        {streak === 0 ? 'no streak yet' : `${streak}d streak`}
      </div>
    </nav>
  )
}
