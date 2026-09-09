'use client'

import { notFound } from 'next/navigation'
import { byId } from '@/problems'
import { Player } from '@/components/Player'

/**
 * Problems carry `trace` and `run` functions, which cannot cross the server
 * component boundary. So the route resolves the id on the client instead of
 * passing a Problem object down as a prop.
 */
export function PlayerRoute({ id }: { id: string }) {
  const problem = byId(id)

  // `page.tsx` already 404s on an unknown id; this is the client-side guard
  // that narrows the type, and it renders the same `not-found.tsx`.
  if (!problem) notFound()

  return <Player problem={problem} />
}
