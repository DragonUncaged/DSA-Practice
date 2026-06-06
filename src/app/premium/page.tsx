import type { Metadata } from 'next'
import { Sheet } from '@/components/Sheet'
import { TopNav } from '@/components/TopNav'

export const metadata: Metadata = {
  title: 'Premium · TRACE',
  description:
    'The eighty-nine LeetCode Premium problems, grouped by difficulty, with a trace on every row that has one.',
}

export default function Page() {
  return (
    <>
      <TopNav />
      <Sheet track="premium" />
    </>
  )
}
