'use client'

import Link from 'next/link'
import s from './ErrorScreen.module.scss'

/**
 * The shared body of every route-level `error.tsx`. Next hands the boundary an
 * error plus a `reset` that re-renders the segment, which is enough to recover
 * from a one-off render crash without a full reload.
 */
export function ErrorScreen({
  title,
  error,
  reset,
}: {
  title: string
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className={s.wrap}>
      <p className={s.eyebrow}>something broke</p>
      <h1 className={s.title}>{title}</h1>
      <p className={s.copy}>
        This is a bug on our side, not in your code. Try again — if it keeps happening, the problem
        is in the authored trace rather than in what you typed.
      </p>
      {error.digest && <p className={s.digest}>digest {error.digest}</p>}
      <div className={s.actions}>
        <button type="button" className={s.reset} onClick={reset}>
          Try again
        </button>
        <Link href="/practice" className={s.link}>
          Back to the problem list
        </Link>
      </div>
    </div>
  )
}
