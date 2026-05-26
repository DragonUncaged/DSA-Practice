import type { Metadata } from 'next'
import { Sheet } from '@/components/Sheet'
import { TopNav } from '@/components/TopNav'

export const metadata: Metadata = {
  title: 'Google · TRACE',
  description:
    'Sixty-two Google-tagged interview problems, split into a core set and its related problems.',
}

export default function Page() {
  return (
    <>
      <TopNav />
      <Sheet track="google" />
    </>
  )
}
