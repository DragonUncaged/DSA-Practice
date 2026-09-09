import Link from 'next/link'
import s from './notFound.module.scss'

/**
 * Rendered when `page.tsx` calls `notFound()` for an id that is not in
 * `PROBLEMS`, so an unknown problem answers 404 instead of 200.
 */
export default function NotFound() {
  return (
    <div className={s.wrap}>
      <p className={s.copy}>No trace has been authored for this problem yet.</p>
      <Link href="/practice" className={s.link}>
        Back to the problem list
      </Link>
    </div>
  )
}
