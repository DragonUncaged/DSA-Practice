'use client'

import type { ArrayView, Tone } from '@/lib/types'
import { TONES, accentAlpha, accentOf, glow, metrics } from './palette'
import s from './ArrayViz.module.scss'

const BAR_H = 146

/**
 * Cells sit at absolute offsets rather than in flow, so when a trace reorders
 * the array the same DOM node slides to its new home instead of the values
 * teleporting between boxes. That's the whole reason `ids` exists.
 */
export function ArrayViz({ view }: { view: ArrayView }) {
  const n = view.data.length
  const isBars = view.mode === 'bars'
  const { w, gap, pitch, font } = metrics(n, isBars ? 60 : 72)
  const cellH = isBars ? BAR_H : Math.round(w * 1.08)
  const stageW = Math.max(n * pitch - gap, 1)

  const pointers = (view.pointers ?? []).filter((p) => p.at != null)
  const lanes = pointers.length ? Math.max(...pointers.map((p) => p.lane ?? 0)) + 1 : 0
  const indexH = view.showIndex === false ? 0 : 18
  const noteH = view.notes ? 14 : 0
  const stageH = cellH + indexH + noteH + lanes * 34 + 8

  // bars are scaled against the largest magnitude present
  const nums = view.data.map((d) => (typeof d === 'number' ? d : 0))
  const peak = Math.max(1, ...nums.map(Math.abs))

  /** Pointer parked on a cell recolours its border and lifts it. */
  const pointerAt = (i: number) => pointers.find((p) => p.at === i)

  const left = (i: number) => i * pitch

  return (
    <div className={s.wrap}>
      {view.title && <div className={s.title}>{view.title}</div>}

      <div className={s.scroller}>
        <div className={s.stage} style={{ width: stageW, height: stageH }}>
          {/* dashed span between two indices */}
          {view.band && view.band.to >= view.band.from && (
            <div
              className={s.band}
              style={{
                left: left(view.band.from) - 6,
                width: (view.band.to - view.band.from) * pitch + w + 12,
                height: cellH + 12,
                borderColor: accentAlpha(view.band.accent ?? 'ok', 0.32),
                background: accentAlpha(view.band.accent ?? 'ok', 0.045),
              }}
            >
              {view.band.label && (
                <span
                  className={s.bandLabel}
                  style={{ color: accentAlpha(view.band.accent ?? 'ok', 0.85) }}
                >
                  {view.band.label}
                </span>
              )}
            </div>
          )}

          {/* waterline, for container-style problems */}
          {isBars && view.fill && view.fill.to > view.fill.from && (
            <>
              <div
                className={s.water}
                style={{
                  left: left(view.fill.from) + w,
                  width: (view.fill.to - view.fill.from) * pitch - w,
                  bottom: stageH - cellH,
                  height: Math.max(2, (view.fill.level / peak) * BAR_H),
                }}
              />
              <div
                className={s.waterLabel}
                style={{
                  left: left(view.fill.from) + w + ((view.fill.to - view.fill.from) * pitch - w) / 2,
                  bottom: stageH - cellH + Math.max(2, (view.fill.level / peak) * BAR_H) + 6,
                }}
              >
                {(view.fill.to - view.fill.from) * view.fill.level}
              </div>
            </>
          )}

          {view.data.map((value, i) => {
            const id = view.ids?.[i] ?? i
            const tone: Tone = view.tones?.[i] ?? 'idle'
            const t = TONES[tone]
            const p = pointerAt(i)
            const accentColor = p ? accentOf(p.accent) : null

            const h = isBars
              ? Math.max(6, (Math.abs(typeof value === 'number' ? value : 0) / peak) * BAR_H)
              : cellH
            const short = isBars && h < 26

            return (
              <div key={id}>
                <div
                  className={`${s.cell} ${isBars ? s.bar : ''}`}
                  style={{
                    left: left(i),
                    top: isBars ? cellH - h : 0,
                    width: w,
                    height: h,
                    fontSize: isBars ? undefined : font,
                    background: accentColor ? accentAlpha(p!.accent, 0.16) : t.bg,
                    borderColor: accentColor ?? t.border,
                    color: accentColor ? '#F2F4F6' : t.fg,
                    opacity: t.opacity,
                    transform: t.lift || accentColor ? 'translateY(-6px)' : 'none',
                    boxShadow: accentColor
                      ? glow(p!.accent)
                      : tone === 'good'
                        ? glow('ok', 0.5)
                        : 'none',
                  }}
                >
                  {!short && String(value)}
                </div>

                {short && (
                  <div
                    className={s.barCap}
                    style={{
                      left: left(i),
                      width: w,
                      bottom: stageH - cellH + h + 4,
                      color: accentColor ?? t.fg,
                      opacity: t.opacity,
                    }}
                  >
                    {String(value)}
                  </div>
                )}

                {view.showIndex !== false && (
                  <div
                    className={s.index}
                    style={{
                      left: left(i),
                      width: w,
                      top: cellH + 4,
                      color: accentColor ?? (tone === 'idle' || tone === 'dim' ? '#3B3E44' : '#55585F'),
                      opacity: tone === 'dim' ? 0.5 : 1,
                    }}
                  >
                    {i}
                  </div>
                )}

                {view.notes?.[i] != null && (
                  <div
                    className={s.note}
                    style={{ left: left(i), width: w, top: cellH + indexH + 2 }}
                  >
                    {view.notes[i]}
                  </div>
                )}
              </div>
            )
          })}

          {pointers.map((p) => (
            <div
              key={p.name}
              className={s.pointer}
              style={{
                left: left(p.at as number),
                width: w,
                top: cellH + indexH + noteH + (p.lane ?? 0) * 34 + 4,
              }}
            >
              <span className={s.arrow} style={{ borderBottomColor: accentOf(p.accent) }} />
              <span
                className={s.chip}
                style={{
                  color: accentOf(p.accent),
                  background: accentAlpha(p.accent, 0.12),
                  borderColor: accentAlpha(p.accent, 0.34),
                }}
              >
                {p.name} = {p.at}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
