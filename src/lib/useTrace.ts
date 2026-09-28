'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Tracer, type Frame, type Solution } from './types'

/** Base dwell time per frame at 1x. */
const BEAT_MS = 1050

export interface TracePlayer {
  frames: Frame[]
  frame: Frame
  index: number
  total: number
  playing: boolean
  speed: number
  atEnd: boolean
  setIndex: (i: number) => void
  step: (delta: number) => void
  toggle: () => void
  reset: () => void
  setSpeed: (s: number) => void
}

/**
 * Frames are computed once and cached. Playback is just an index into them,
 * which is what makes scrubbing and reverse-stepping free.
 */
export function useTrace(solution: Solution | undefined, demo: unknown[]): TracePlayer {
  const frames = useMemo(() => {
    // A practice-only solution has no trace; it plays as zero frames.
    if (!solution?.trace) return []
    const t = new Tracer()
    try {
      solution.trace(t, demo)
    } catch (err) {
      // A broken trace should degrade to "no animation", never a blank screen.
      console.error('trace failed', err)
    }
    return t.frames
  }, [solution, demo])

  const [index, setIndexRaw] = useState(0)
  const [wantPlay, setWantPlay] = useState(false)
  const [speed, setSpeed] = useState(1)

  const total = frames.length
  const last = Math.max(0, total - 1)
  const clamped = Math.min(index, last)
  const atEnd = clamped >= last

  // Playback is derived, not stored: asking to play while sitting on the last
  // frame simply isn't playing. Storing it would mean switching it off from
  // inside the timer effect, which is a cascading render.
  const playing = wantPlay && !atEnd

  // Reset when the traced solution changes underneath us. Adjusting state
  // during render is React's documented alternative to an effect here.
  const [prevSolution, setPrevSolution] = useState(solution)
  if (solution !== prevSolution) {
    setPrevSolution(solution)
    setIndexRaw(0)
    setWantPlay(false)
  }

  const setIndex = useCallback(
    (i: number) => {
      setWantPlay(false)
      setIndexRaw(Math.max(0, Math.min(last, i)))
    },
    [last],
  )

  const step = useCallback(
    (delta: number) => {
      setWantPlay(false)
      setIndexRaw((i) => Math.max(0, Math.min(last, i + delta)))
    },
    [last],
  )

  const toggle = useCallback(() => {
    // pressing play at the end restarts rather than doing nothing
    if (clamped >= last) {
      setIndexRaw(0)
      setWantPlay(true)
      return
    }
    setWantPlay((p) => !p)
  }, [clamped, last])

  const reset = useCallback(() => {
    setWantPlay(false)
    setIndexRaw(0)
  }, [])

  useEffect(() => {
    if (!playing) return
    const id = setTimeout(() => setIndexRaw((i) => Math.min(last, i + 1)), BEAT_MS / speed)
    return () => clearTimeout(id)
  }, [playing, clamped, last, speed])

  return {
    frames,
    frame: frames[clamped],
    index: clamped,
    total,
    playing,
    speed,
    atEnd,
    setIndex,
    step,
    toggle,
    reset,
    setSpeed,
  }
}

/** Arrow keys scrub, space plays. Skipped while focus is in an editor or input. */
export function useTraceKeys(player: TracePlayer, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el as HTMLElement | null)?.isContentEditable
      if (typing) return

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        player.step(1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        player.step(-1)
      } else if (e.key === ' ') {
        e.preventDefault()
        player.toggle()
      } else if (e.key === 'Home') {
        e.preventDefault()
        player.reset()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [player, enabled])
}
