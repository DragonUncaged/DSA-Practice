'use client'

import { Fragment } from 'react'
import type { GridView, Tone } from '@/lib/types'
import { TONES, glow } from './palette'
import s from './GridViz.module.scss'

/** Cells shrink as the grid grows so a 12x12 DP table still fits the stage. */
function cellSize(rows: number, cols: number) {
  const big = Math.max(rows, cols)
  if (big <= 5) return 52
  if (big <= 8) return 42
  if (big <= 11) return 34
  if (big <= 15) return 27
  return 21
}

export function GridViz({ view }: { view: GridView }) {
  const rows = view.data.length
  const cols = rows ? view.data[0].length : 0
  const size = cellSize(rows, cols)
  const font = Math.max(9, Math.round(size * 0.34))

  const hasRowLabels = !!view.rowLabels
  const hasColLabels = !!view.colLabels
  const labelW = hasRowLabels ? 26 : 0

  return (
    <div className={s.wrap}>
      {view.title && <div className={s.title}>{view.title}</div>}

      <div className={s.scroller}>
        <div
          className={s.table}
          style={{
            gridTemplateColumns: `${hasRowLabels ? `${labelW}px ` : ''}repeat(${cols}, ${size}px)`,
          }}
        >
          {hasColLabels && (
            <Fragment key="colLabels">
              {hasRowLabels && <div className={s.corner} />}
              {view.colLabels!.map((c, j) => (
                <div key={`c${j}`} className={s.colLabel} style={{ height: 16 }}>
                  {c}
                </div>
              ))}
            </Fragment>
          )}

          {view.data.map((row, i) => (
            <Fragment key={`row-${i}`}>
              {hasRowLabels && (
                <div className={s.rowLabel} style={{ height: size }}>
                  {view.rowLabels![i]}
                </div>
              )}
              {row.map((value, j) => {
                const tone: Tone = view.tones?.[`${i},${j}`] ?? 'idle'
                const t = TONES[tone]
                const isCursor = view.cursor?.[0] === i && view.cursor?.[1] === j
                return (
                  <div
                    key={`${i}-${j}`}
                    className={`${s.cell} ${isCursor ? s.cursor : ''} ${view.glyph ? s.glyph : ''}`}
                    style={{
                      width: size,
                      height: size,
                      fontSize: font,
                      background: t.bg,
                      borderColor: isCursor ? '#FFFFFF' : t.border,
                      color: t.fg,
                      opacity: t.opacity,
                      boxShadow: isCursor
                        ? '0 8px 22px -10px rgba(255,255,255,0.5)'
                        : tone === 'good'
                          ? glow('ok', 0.45)
                          : 'none',
                    }}
                  >
                    {view.glyph ? '' : String(value)}
                  </div>
                )
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
