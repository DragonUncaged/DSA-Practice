import type { Metadata } from 'next'
import { Sheet } from '@/components/Sheet'
import { TopNav } from '@/components/TopNav'

export const metadata: Metadata = {
  title: 'Blind 75 · TRACE',
  description: 'The Blind 75, with a stepped visual trace for every problem that has one.',
}

export default function Page() {
  return (
    <>
      <TopNav />
      <Sheet />
    </>
  )
}
