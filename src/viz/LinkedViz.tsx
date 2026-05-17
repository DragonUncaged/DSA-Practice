'use client'

import type { ListView, Tone, TreeView } from '@/lib/types'
import { TONES, accentAlpha, accentOf, glow } from './palette'
import s from './LinkedViz.module.scss'

const ARROW_ID = 'trace-arrow'

function ArrowDefs() {
  return (
    <defs>
      <marker
        id={ARROW_ID}
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
      </marker>
    </defs>
  )
}

// ---------------------------------------------------------------------------
// Linked list
// ---------------------------------------------------------------------------

/**
 * Nodes stay pinned in their original left-to-right order and only the arrows
 * move. That's deliberate: in Reverse a Linked List the insight *is* that the
 * boxes never move, the pointers do.
 */
export function ListViz({ view }: { view: ListView }) {
  const n = view.nodes.length
  const NW = n <= 6 ? 58 : n <= 9 ? 48 : 40
  const NH = Math.round(NW * 0.66)
  const GAP = Math.round(NW * 0.72)
  const pitch = NW + GAP
  const ARC = 40 // headroom above the row for backward links

  const pointers = (view.pointers ?? []).filter((p) => p.at != null)
  // extra rows when several pointers stand on the same node and stack in lanes
  const maxShared = pointers.length
    ? Math.max(...pointers.map((p) => pointers.filter((q) => q.at === p.at).length))
    : 0
  const stageW = n * pitch
  const stageH = ARC + NH + (pointers.length ? 40 + (maxShared - 1) * 32 : 8)

  const index = new Map(view.nodes.map((nd, i) => [nd.id, i]))
  const x = (i: number) => i * pitch
  const cx = (i: number) => x(i) + NW / 2
  const cy = ARC + NH / 2

  const path = (from: number, to: number) => {
    const a = cx(from)
    const b = cx(to)
    if (Math.abs(from - to) === 1) {
      // adjacent: straight shot between the two box edges
      const dir = to > from ? 1 : -1
      return `M ${a + dir * (NW / 2 + 4)} ${cy} L ${b - dir * (NW / 2 + 6)} ${cy}`
    }
    // anything else arcs over the top so it can't be confused with a neighbour link
    const top = ARC + NH / 2 - Math.min(ARC, 18 + Math.abs(from - to) * 6)
    return `M ${a} ${ARC} Q ${(a + b) / 2} ${top - 20} ${b} ${ARC}`
  }

  return (
    <div className={s.wrap}>
      {view.title && <div className={s.title}>{view.title}</div>}

      <div className={s.scroller}>
        <div className={s.stage} style={{ width: stageW, height: stageH }}>
          <svg className={s.edges} width={stageW} height={stageH}>
            <ArrowDefs />
            {view.links.map((l) => {
              const from = index.get(l.from)
              if (from == null) return null
              const to = l.to == null ? null : index.get(l.to)
              const tone = view.tones?.[l.from]
              const stroke =
                tone === 'active' || tone === 'good' ? accentOf('ok') : 'rgba(255,255,255,0.34)'

              if (to == null) {
                // Only the right-most node has room for a null stub. Once a link
                // reverses, an interior node can also point at null — drawing a
                // stub there would run straight into its neighbour, so that case
                // renders as simply having no outgoing arrow, which reads the same.
                if (from !== n - 1) return null
                return (
                  <path
                    key={`e-${l.from}`}
                    d={`M ${cx(from) + NW / 2 + 4} ${cy} L ${cx(from) + NW / 2 + GAP - 14} ${cy}`}
                    stroke={stroke}
                    strokeWidth={1.5}
                    fill="none"
                    color={stroke}
                    markerEnd={`url(#${ARROW_ID})`}
                  />
                )
              }

              return (
                <path
                  key={`e-${l.from}`}
                  d={path(from, to)}
                  stroke={stroke}
                  strokeWidth={1.5}
                  fill="none"
                  color={stroke}
                  markerEnd={`url(#${ARROW_ID})`}
                />
              )
            })}
          </svg>

          {view.nodes.map((nd, i) => {
            const tone: Tone = view.tones?.[nd.id] ?? 'band'
            const t = TONES[tone]
            const p = pointers.find((q) => q.at === nd.id)
            const accent = p ? accentOf(p.accent) : null
            return (
              <div
                key={nd.id}
                className={`${s.node} ${s.box}`}
                style={{
                  left: x(i),
                  top: ARC,
                  width: NW,
                  height: NH,
                  fontSize: Math.max(12, Math.round(NW * 0.28)),
                  background: accent ? accentAlpha(p!.accent, 0.16) : t.bg,
                  borderColor: accent ?? t.border,
                  color: accent ? '#F2F4F6' : t.fg,
                  opacity: t.opacity,
                  transform: accent || t.lift ? 'translateY(-4px)' : 'none',
                  boxShadow: accent ? glow(p!.accent) : tone === 'good' ? glow('ok', 0.45) : 'none',
                }}
              >
                {String(nd.value)}
              </div>
            )
          })}

          {/* null terminator, drawn only where there is room for it */}
          {view.links
            .filter((l) => l.to == null)
            .map((l) => {
              const i = index.get(l.from)
              if (i == null || i !== n - 1) return null
              return (
                <div
                  key={`null-${l.from}`}
                  className={s.nullCap}
                  style={{ left: x(i) + NW + GAP - 8, top: ARC, width: 24, height: NH }}
                >
                  &empty;
                </div>
              )
            })}

          {pointers.map((p, k) => {
            const i = index.get(p.at as number)
            if (i == null) return null
            // pointers sharing a node stack in separate lanes instead of overprinting
            const lane = pointers.slice(0, k).filter((q) => index.get(q.at as number) === i).length
            return (
              <div
                key={p.name}
                className={s.pointer}
                style={{ left: x(i), width: NW, top: ARC + NH + 6 + lane * 32 }}
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
                  {p.name}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Binary tree
// ---------------------------------------------------------------------------

/** In-order slot assignment: gives every node a distinct column, no overlaps. */
function layout(view: TreeView) {
  const byId = new Map(view.nodes.map((n) => [n.id, n]))
  const pos = new Map<number, { col: number; depth: number }>()
  let col = 0

  const walk = (id: number | null | undefined, depth: number) => {
    if (id == null) return
    const node = byId.get(id)
    if (!node) return
    walk(node.left, depth + 1)
    pos.set(id, { col: col++, depth })
    walk(node.right, depth + 1)
  }

  walk(view.root, 0)
  const depth = pos.size ? Math.max(...[...pos.values()].map((p) => p.depth)) : 0
  return { pos, cols: col, depth, byId }
}

export function TreeViz({ view }: { view: TreeView }) {
  const { pos, cols, depth, byId } = layout(view)
  const R = cols <= 7 ? 21 : cols <= 12 ? 17 : 14
  const pitchX = R * 2 + (cols <= 7 ? 30 : cols <= 12 ? 18 : 10)
  const pitchY = R * 2 + 30

  const stageW = Math.max(cols * pitchX, 1)
  const stageH = (depth + 1) * pitchY

  const cx = (id: number) => (pos.get(id)!.col + 0.5) * pitchX
  const cy = (id: number) => pos.get(id)!.depth * pitchY + R + 4

  return (
    <div className={s.wrap}>
      {view.title && <div className={s.title}>{view.title}</div>}

      <div className={s.scroller}>
        <div className={s.stage} style={{ width: stageW, height: stageH }}>
          <svg className={s.edges} width={stageW} height={stageH}>
            {view.nodes.map((n) => {
              if (!pos.has(n.id)) return null
              return ([n.left, n.right] as (number | null | undefined)[])
                .filter((c): c is number => c != null && pos.has(c) && byId.has(c))
                .map((c) => (
                  <line
                    key={`${n.id}-${c}`}
                    x1={cx(n.id)}
                    y1={cy(n.id)}
                    x2={cx(c)}
                    y2={cy(c)}
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth={1.4}
                  />
                ))
            })}
          </svg>

          {view.nodes.map((n) => {
            if (!pos.has(n.id)) return null
            const tone: Tone = view.tones?.[n.id] ?? 'band'
            const t = TONES[tone]
            const p = (view.pointers ?? []).find((q) => q.at === n.id)
            const accent = p ? accentOf(p.accent) : null
            return (
              <div
                key={n.id}
                className={`${s.node} ${s.circle}`}
                style={{
                  left: cx(n.id) - R,
                  top: cy(n.id) - R,
                  width: R * 2,
                  height: R * 2,
                  fontSize: Math.max(10, Math.round(R * 0.72)),
                  background: accent ? accentAlpha(p!.accent, 0.18) : t.bg,
                  borderColor: accent ?? t.border,
                  color: accent ? '#F2F4F6' : t.fg,
                  opacity: t.opacity,
                  transform: accent || t.lift ? 'scale(1.12)' : 'none',
                  boxShadow: accent ? glow(p!.accent) : tone === 'good' ? glow('ok', 0.45) : 'none',
                }}
              >
                {String(n.value)}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
