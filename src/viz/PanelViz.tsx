'use client'

import type { MapView, StackView, Tone } from '@/lib/types'
import { TONES } from './palette'
import s from './PanelViz.module.scss'

/**
 * Frames are snapshots, so a push isn't an event we can observe — but React
 * mounting a new node is. Keying stack items by their depth means a push mounts
 * exactly one element and the `pop` keyframe fires on it for free.
 */
export function StackViz({ view }: { view: StackView }) {
  const items = view.items
  const order = view.flip ? items : [...items].reverse()

  return (
    <div className={s.wrap}>
      {view.title && <div className={s.title}>{view.title}</div>}
      <div className={`${s.stack} ${view.flip ? s.flip : ''}`}>
        {items.length === 0 && <div className={s.empty}>empty</div>}
        {order.map((value, k) => {
          const depth = view.flip ? k : items.length - 1 - k
          const tone: Tone = view.tones?.[depth] ?? (depth === items.length - 1 ? 'active' : 'band')
          const t = TONES[tone]
          return (
            <div
              key={depth}
              className={s.stackItem}
              style={{ background: t.bg, borderColor: t.border, color: t.fg }}
            >
              {String(value)}
            </div>
          )
        })}
        <div className={s.floor} />
      </div>
    </div>
  )
}

export function MapViz({ view }: { view: MapView }) {
  return (
    <div className={s.wrap}>
      {view.title && <div className={s.title}>{view.title}</div>}
      <div className={s.map}>
        {view.entries.length === 0 && <div className={s.empty}>empty</div>}
        {view.entries.map((e, i) => {
          const t = TONES[e.tone ?? 'band']
          return (
            <div
              key={`${e.k}-${i}`}
              className={s.entry}
              style={{ background: t.bg, borderColor: t.border, color: t.fg }}
            >
              <span>{String(e.k)}</span>
              {!view.asSet && e.v !== undefined && (
                <>
                  <span className={s.arrow}>&rarr;</span>
                  <span className={s.val}>{String(e.v)}</span>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
