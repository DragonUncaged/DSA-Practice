'use client'

import { ErrorScreen } from '@/components/ErrorScreen'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorScreen title="This page could not be rendered." error={error} reset={reset} />
}
