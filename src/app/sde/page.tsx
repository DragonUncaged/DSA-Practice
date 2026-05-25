import type { Metadata } from 'next'
import { Sheet } from '@/components/Sheet'
import { TopNav } from '@/components/TopNav'

export const metadata: Metadata = {
  title: 'SDE Sheet · TRACE',
  description:
    'A 27-day SDE sheet with stepped visual traces for every problem that has one.',
}

export default function Page() {
  return (
    <>
      <TopNav />
      <Sheet track="sde" />
    </>
  )
}
