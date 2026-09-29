'use client'

import { useEffect, useMemo, useState } from 'react'
import { Tracer, type Frame, type PracticeProblem, type Solution } from '@/lib/types'
import { Stage } from './PlayerParts'
import parts from './PlayerParts.module.scss'
import s from './CompareView.module.scss'

const BEAT_MS = 900

function buildFrames(solution: Solution | undefined, demo: unknown[]): Frame[] {
  if (!solution?.trace) return []
  const t = new Tracer(900)
  try {
    solution.trace(t, demo)
  } catch (err) {
    console.error('trace failed', err)
  }
  return t.frames
}

/**
 * Both solutions run on the same input and advance one step per beat. The
 * optimal one runs out of steps early and sits there finished while the brute
 * force is still grinding — that gap is the entire lesson, so nothing here
 * normalises the two timelines to the same length.
 */
export function CompareView({ problem }: { problem: PracticeProblem }) {
  const brute = problem.solutions.find((x) => x.kind === 'brute')
  const optimal = problem.solutions.find((x) => x.kind === 'optimal') ?? problem.solutions[0]

  // only a traced problem reaches this tab, and those always carry a demo
  const demo = useMemo(() => problem.demo ?? [], [problem.demo])
  const bruteFrames = useMemo(() => buildFrames(brute, demo), [brute, demo])
  const optFrames = useMemo(() => buildFrames(optimal, demo), [optimal, demo])

  const total = Math.max(bruteFrames.length, optFrames.length)
  const last = Math.max(0, total - 1)

  const [i, setI] = useState(0)
  const [wantPlay, setWantPlay] = useState(false)
  const [speed, setSpeed] = useState(1)

  // derived rather than stored, so the timer effect never has to switch it off
  const playing = wantPlay && i < last

  useEffect(() => {
    if (!playing) return
    const id = setTimeout(() => setI((k) => Math.min(last, k + 1)), BEAT_MS / speed)
    return () => clearTimeout(id)
  }, [playing, i, last, speed])

  const pick = (frames: Frame[]) => frames[Math.min(i, frames.length - 1)]
  const bFrame = pick(bruteFrames)
  const oFrame = pick(optFrames)

  const bDone = i >= bruteFrames.length - 1
  const oDone = i >= optFrames.length - 1

  const bOps = bruteFrames.at(-1)?.ops ?? 0
  const oOps = optFrames.at(-1)?.ops ?? 0
  const ratio = oOps > 0 ? Math.round((bOps / oOps) * 10) / 10 : null

  const column = (
    label: string,
    kindLabel: string,
    time: string,
    frame: Frame | undefined,
    done: boolean,
    steps: number,
    accent: boolean,
  ) => (
    <div className={s.col}>
      <div className={s.colHead}>
        <span className={s.name}>{label}</span>
        <span className={s.badge}>{kindLabel}</span>
        <span className={s.badge}>{time}</span>
        <span className={s.spacer} />
        <span className={s.ops}>
          <span className={s.num} style={{ color: accent ? '#CDFF57' : '#FF7A59' }}>
            {(frame?.ops ?? 0).toLocaleString()}
          </span>
          <span className={s.word}>ops</span>
        </span>
      </div>
      <div className={s.stageSlot}>
        {done && i > 0 && (
          <div className={s.finished}>
            finished in {steps} steps &middot; {(frame?.ops ?? 0).toLocaleString()} ops
          </div>
        )}
        <Stage frame={frame} />
      </div>
    </div>
  )

  return (
    <div className={s.wrap}>
      <div className={s.columns}>
        {column(
          brute?.label ?? 'Brute force',
          'BRUTE',
          brute?.time ?? '',
          bFrame,
          bDone,
          bruteFrames.length,
          false,
        )}
        {column(
          optimal?.label ?? 'Optimal',
          'OPTIMAL',
          optimal?.time ?? '',
          oFrame,
          oDone,
          optFrames.length,
          true,
        )}
      </div>

      <div className={parts.transport}>
        <div className={parts.controls}>
          <button
            className={parts.btn}
            onClick={() => setI((k) => Math.max(0, k - 1))}
            disabled={i === 0}
            aria-label="Previous step"
          >
            &#9664;
          </button>
          <button
            className={`${parts.btn} ${parts.play}`}
            onClick={() => {
              if (i >= last) {
                setI(0)
                setWantPlay(true)
              } else setWantPlay((p) => !p)
            }}
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? '❚❚' : '▶'}
          </button>
          <button
            className={parts.btn}
            onClick={() => setI((k) => Math.min(last, k + 1))}
            disabled={i >= last}
            aria-label="Next step"
          >
            &#9654;
          </button>
          <button
            className={`${parts.btn} ${parts.wide}`}
            onClick={() => {
              setWantPlay(false)
              setI(0)
            }}
          >
            Reset
          </button>
        </div>

        <div
          className={parts.scrub}
          onMouseDown={(e) => {
            const box = e.currentTarget.getBoundingClientRect()
            const pct = Math.min(0.9999, Math.max(0, (e.clientX - box.left) / box.width))
            setWantPlay(false)
            setI(Math.floor(pct * total))
          }}
        >
          {Array.from({ length: total }, (_, k) => (
            <div
              key={k}
              className={parts.tick}
              style={{
                height: k === i ? 18 : 6,
                background: k === i ? '#CDFF57' : k < i ? 'rgba(205,255,87,0.34)' : '#1D1E23',
              }}
            />
          ))}
        </div>

        <div className={parts.stepLabel}>
          {total === 0 ? '—' : `${i + 1} / ${total}`}
        </div>

        <div className={parts.segmented}>
          {[0.5, 1, 1.5, 2].map((v) => (
            <button
              key={v}
              className={`${parts.seg} ${speed === v ? parts.on : ''}`}
              onClick={() => setSpeed(v)}
            >
              {v}x
            </button>
          ))}
        </div>
      </div>

      <div className={s.verdict}>
        {ratio && ratio > 1 ? (
          <span>
            On this input the brute force did <strong>{bOps.toLocaleString()}</strong>{' '}
            operations to the optimal solution&apos;s <strong>{oOps.toLocaleString()}</strong>
            {' \u2014 '}
            <strong>{ratio}x</strong> the work. The gap widens with every element you add.
          </span>
        ) : (
          <span>Press play to run both solutions on the same input.</span>
        )}
      </div>
    </div>
  )
}
