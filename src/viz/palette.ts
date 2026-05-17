import type { Accent, Tone } from '@/lib/types'

export interface ToneStyle {
  bg: string
  border: string
  fg: string
  opacity: number
  /** Lifts the cell off the baseline — reserved for cells under a pointer. */
  lift?: boolean
}

/**
 * One tone vocabulary shared by every renderer, so `active` means the same
 * thing whether you're looking at an array, a grid or a tree.
 */
export const TONES: Record<Tone, ToneStyle> = {
  idle: { bg: '#111115', border: 'rgba(255,255,255,0.07)', fg: '#6C7079', opacity: 0.5 },
  dim: { bg: '#0D0D10', border: 'rgba(255,255,255,0.04)', fg: '#3B3E44', opacity: 0.32 },
  band: { bg: '#141419', border: 'rgba(255,255,255,0.11)', fg: '#C9CCD2', opacity: 1 },
  done: { bg: '#121217', border: 'rgba(255,255,255,0.07)', fg: '#7C8089', opacity: 0.82 },
  active: { bg: '#1C1D23', border: 'rgba(255,255,255,0.42)', fg: '#FFFFFF', opacity: 1, lift: true },
  good: { bg: 'rgba(205,255,87,0.15)', border: '#CDFF57', fg: '#F4FFDC', opacity: 1, lift: true },
  bad: { bg: 'rgba(255,122,89,0.12)', border: 'rgba(255,122,89,0.55)', fg: '#FFC4B2', opacity: 1 },
  accent: { bg: 'rgba(185,140,255,0.14)', border: '#B98CFF', fg: '#EADCFF', opacity: 1 },
}

export const ACCENTS: Record<Accent, string> = {
  a: '#FF7A59',
  b: '#56C7FF',
  c: '#B98CFF',
  ok: '#CDFF57',
  no: '#6C7079',
  mute: '#55585F',
}

export const accentOf = (a?: Accent) => ACCENTS[a ?? 'mute']

/** rgba() form of an accent, for translucent fills and glows. */
export function accentAlpha(a: Accent | undefined, alpha: number) {
  const hex = accentOf(a).replace('#', '')
  const n = parseInt(hex, 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

export const glow = (a: Accent | undefined, strength = 0.55) =>
  `0 10px 30px -12px ${accentAlpha(a, strength)}`

/**
 * Cell pitch shrinks as the collection grows so a 30-element array still fits
 * on screen without the 8-element case looking cramped.
 */
export function metrics(n: number, max = 72) {
  const w = n <= 8 ? max : n <= 12 ? 58 : n <= 18 ? 46 : n <= 26 ? 38 : n <= 40 ? 30 : 24
  const gap = Math.max(5, Math.round(w * 0.22))
  return { w, gap, pitch: w + gap, font: Math.max(11, Math.round(w * 0.3)) }
}
