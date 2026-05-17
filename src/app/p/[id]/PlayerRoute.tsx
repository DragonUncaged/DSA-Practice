'use client'

import Link from 'next/link'
import { byId } from '@/problems'
import { Player } from '@/components/Player'

/**
 * Problems carry `trace` and `run` functions, which cannot cross the server
 * component boundary. So the route resolves the id on the client instead of
 * passing a Problem object down as a prop.
 */
export function PlayerRoute({ id }: { id: string }) {
  const problem = byId(id)

  if (!problem) {
    return (
      <main
        style={{
          display: 'grid',
          placeItems: 'center',
          gap: 14,
          minHeight: '100dvh',
          textAlign: 'center',
          padding: 24,
        }}
      >
        <p style={{ color: '#83878F' }}>No trace has been authored for this problem yet.</p>
        <Link href="/practice" style={{ color: '#CDFF57' }}>
          Back to the problem list
        </Link>
      </main>
    )
  }

  return <Player problem={problem} />
}
