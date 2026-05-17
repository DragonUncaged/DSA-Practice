import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PatternIntro } from '@/components/PatternIntro'
import { TopNav } from '@/components/TopNav'
import { PATTERNS, patternById } from '@/patterns'

export function generateStaticParams() {
  return PATTERNS.map((p) => ({ id: p.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const pattern = patternById(id)
  if (!pattern) return { title: 'Not found · TRACE' }
  return {
    title: `${pattern.name} · TRACE`,
    description: pattern.tagline,
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pattern = patternById(id)
  if (!pattern) notFound()
  return (
    <>
      <TopNav />
      <PatternIntro id={id} />
    </>
  )
}
