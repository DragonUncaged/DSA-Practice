import type { Metadata } from 'next'
import { PatternsHome } from '@/components/PatternsHome'
import { TopNav } from '@/components/TopNav'

export const metadata: Metadata = {
  title: 'Patterns · TRACE',
  description: 'Learn each algorithm pattern with a toy animation, then ramp through the problems that use it.',
}

export default function Page() {
  return (
    <>
      <TopNav />
      <PatternsHome />
    </>
  )
}
