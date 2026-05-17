'use client'

import { useEffect } from 'react'
import { hydrateStore } from '@/lib/store'

/** Mounted once in the root layout; renders nothing. */
export function StoreHydrator() {
  useEffect(() => hydrateStore(), [])
  return null
}
