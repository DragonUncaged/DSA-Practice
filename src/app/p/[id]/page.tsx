import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PROBLEMS, byId } from '@/problems'
import { PlayerRoute } from './PlayerRoute'

export function generateStaticParams() {
  return PROBLEMS.map((p) => ({ id: p.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const problem = byId(id)
  if (!problem) return { title: 'Not found · TRACE' }
  return {
    title: `${problem.title} · TRACE`,
    description: problem.statement.replace(/`/g, '').slice(0, 160),
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!byId(id)) notFound()
  return <PlayerRoute id={id} />
}
