'use client'

import { useRef, useState } from 'react'
import type { CodeBlock, Frame, Lang, Solution } from '@/lib/types'
import type { RevealLevel } from '@/lib/store'
import type { TracePlayer } from '@/lib/useTrace'
import { accentAlpha, accentOf } from '@/viz/palette'
import { Renderer } from '@/viz/Renderer'
import s from './PlayerParts.module.scss'

export const LANG_LABEL: Record<Lang, string> = { py: 'PYTHON', cpp: 'C++', js: 'JAVASCRIPT' }
export const LANGS: Lang[] = ['py', 'cpp', 'js']

// ---------------------------------------------------------------------------

export function Stage({ frame }: { frame: Frame | undefined }) {
  if (!frame) {
    return (
      <div className={s.stage}>
        <div className={s.emptyStage}>
          <div>No trace authored for this problem yet.</div>
        </div>
      </div>
    )
  }

  return (
    <div className={s.stage}>
      <div className={s.viz}>
        <Renderer view={frame.view} />
      </div>

      <div className={s.readout}>
        {frame.badge && (
          <div
            key={frame.badge.text}
            className={s.badge}
            style={{
              color: accentOf(frame.badge.accent),
              background: accentAlpha(frame.badge.accent, 0.11),
              borderColor: accentAlpha(frame.badge.accent, 0.3),
            }}
          >
            {frame.badge.text}
          </div>
        )}
        <p className={s.note}>{frame.note}</p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

const SPEEDS = [0.5, 1, 1.5, 2]

export function Transport({ player }: { player: TracePlayer }) {
  const scrubRef = useRef<HTMLDivElement>(null)

  const jump = (clientX: number) => {
    const el = scrubRef.current
    if (!el || player.total === 0) return
    const box = el.getBoundingClientRect()
    const pct = Math.min(0.9999, Math.max(0, (clientX - box.left) / box.width))
    player.setIndex(Math.floor(pct * player.total))
  }

  return (
    <div className={s.transport}>
      <div className={s.controls}>
        <button
          className={s.btn}
          onClick={() => player.step(-1)}
          disabled={player.index === 0}
          aria-label="Previous step"
          title="Previous step (left arrow)"
        >
          &#9664;
        </button>
        <button
          className={`${s.btn} ${s.play}`}
          onClick={player.toggle}
          aria-label={player.playing ? 'Pause' : 'Play'}
          title="Play / pause (space)"
        >
          {player.playing ? '❚❚' : '▶'}
        </button>
        <button
          className={s.btn}
          onClick={() => player.step(1)}
          disabled={player.atEnd}
          aria-label="Next step"
          title="Next step (right arrow)"
        >
          &#9654;
        </button>
        <button className={`${s.btn} ${s.wide}`} onClick={player.reset} title="Back to start">
          Reset
        </button>
      </div>

      {/* every tick is one real step of the algorithm, not a time slice */}
      <div
        ref={scrubRef}
        className={s.scrub}
        role="slider"
        tabIndex={0}
        aria-label="Step"
        aria-valuemin={1}
        aria-valuemax={Math.max(1, player.total)}
        aria-valuenow={player.index + 1}
        onMouseDown={(e) => jump(e.clientX)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') player.step(1)
          if (e.key === 'ArrowLeft') player.step(-1)
        }}
      >
        {player.frames.map((_, i) => (
          <div
            key={i}
            className={s.tick}
            style={{
              height: i === player.index ? 18 : 6,
              background:
                i === player.index ? '#CDFF57' : i < player.index ? 'rgba(205,255,87,0.34)' : '#1D1E23',
            }}
          />
        ))}
      </div>

      <div className={s.stepLabel}>
        {player.total === 0 ? '—' : `${player.index + 1} / ${player.total}`}
      </div>

      {player.frame && (
        <div className={s.opCount} title="Operations performed so far in this run">
          <span className={s.opNum}>{player.frame.ops.toLocaleString()}</span>
          <span className={s.opWord}>ops</span>
        </div>
      )}

      <div className={s.segmented}>
        {SPEEDS.map((v) => (
          <button
            key={v}
            className={`${s.seg} ${player.speed === v ? s.on : ''}`}
            onClick={() => player.setSpeed(v)}
          >
            {v}x
          </button>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

export function CodePane({
  solution,
  lang,
  onLang,
  step,
  revealLevel,
  onRevealLevel,
  watched,
  height,
  children,
}: {
  solution: Solution | undefined
  lang: Lang
  onLang: (l: Lang) => void
  step: string | undefined
  revealLevel: RevealLevel
  onRevealLevel: (l: RevealLevel) => void
  watched: Set<number>
  /** Explicit panel height from the drag handle; null/undefined = stylesheet default. */
  height?: number | null
  children?: React.ReactNode
}) {
  const block: CodeBlock | undefined = solution?.code[lang]
  const hot = block && step ? block.map[step] : undefined
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (!block) return
    // copying the answer is assistance — it implies a full reveal
    if (revealLevel < 3) onRevealLevel(3)
    const source = block.lines.join('\n') + '\n'
    try {
      await navigator.clipboard.writeText(source)
    } catch {
      // clipboard API blocked (http, permissions) — fall back to a hidden textarea
      const ta = document.createElement('textarea')
      ta.value = source
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  // The lines the algorithm actually executes — the ones worth earning.
  // Structural lines (declarations, braces) are visible from "watch" upward.
  const algoLines = new Set(Object.values(block?.map ?? {}))
  const watchedAlgo = [...algoLines].filter((n) => watched.has(n)).length

  const masked = (n: number): boolean => {
    if (revealLevel >= 3) return false
    if (n === 1) return false // the signature is already in the starter code
    if (revealLevel === 2) return algoLines.has(n) ? !watched.has(n) : false
    return true
  }

  const LADDER: { level: RevealLevel; label: string; hint: string }[] = [
    { level: 0, label: 'Fogged', hint: 'Hide the solution again' },
    { level: 1, label: 'Approach', hint: 'Reveal the idea in one paragraph' },
    { level: 2, label: 'Watch', hint: 'Each line unfogs the moment the trace executes it' },
    { level: 3, label: 'Full', hint: 'Reveal everything (marks this solve as assisted)' },
  ]

  return (
    <div className={s.codeWrap} style={height != null ? { height } : undefined}>
      <div className={s.codeCol}>
        <div className={s.paneHead}>
          <span className={s.paneTitle}>Solution</span>
          <div className={s.fogCtl}>
            {LADDER.map((o) => (
              <button
                key={o.level}
                className={`${s.fogSeg} ${revealLevel === o.level ? s.on : ''}`}
                title={o.hint}
                onClick={() => onRevealLevel(o.level)}
              >
                {o.level === 0 && <span aria-hidden>&#9679; </span>}
                {o.label}
              </button>
            ))}
          </div>
          {revealLevel === 2 && (
            <span className={s.watchCount}>
              {watchedAlgo} / {algoLines.size} lines earned
            </span>
          )}
          <span className={s.spacer} />
          <button
            className={`${s.copyBtn} ${copied ? s.did : ''}`}
            onClick={copy}
            title={
              revealLevel < 3
                ? 'Reveals the full solution (counts as assisted) and copies it'
                : 'Copy this solution to the clipboard'
            }
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
          <div className={s.segmented}>
            {LANGS.map((l) => (
              <button
                key={l}
                className={`${s.seg} ${lang === l ? s.on : ''}`}
                onClick={() => onLang(l)}
              >
                {LANG_LABEL[l]}
              </button>
            ))}
          </div>
        </div>

        {revealLevel >= 1 && solution && (
          <div className={s.approach}>
            <span className={s.approachTag}>{solution.label}</span>
            <p>{solution.blurb}</p>
          </div>
        )}

        {revealLevel === 0 && (
          <div className={s.fogNote}>
            The solution is under fog. Read the <strong>approach</strong>, switch to{' '}
            <strong>watch</strong> and earn each line as the animation executes it, or reveal it{' '}
            <strong>full</strong>.
          </div>
        )}

        <div className={s.codeBody}>
          {block?.lines.map((src, i) => {
            const n = i + 1
            const hide = masked(n)
            const indent = src.length - src.trimStart().length
            return (
              <div key={i} className={`${s.line} ${hot === n ? s.hot : ''}`}>
                <span className={s.bar} />
                <span className={s.num}>{n}</span>
                {hide ? (
                  <span className={s.src} aria-hidden>
                    {' '.repeat(indent)}
                    <span
                      className={`${s.maskBar} ${algoLines.has(n) ? s.maskAlgo : ''}`}
                      style={{ width: `${Math.max(3, src.trim().length)}ch` }}
                    />
                  </span>
                ) : (
                  <span className={`${s.src} ${revealLevel === 2 && algoLines.has(n) ? s.earned : ''}`}>
                    {src}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------

export function StatePane({ frame }: { frame: Frame | undefined }) {
  return (
    <div className={s.statePane}>
      <div className={s.paneHead}>
        <span className={s.paneTitle}>State</span>
      </div>
      <div className={s.stateBody}>
        {!frame?.vars.length && <div className={s.stateEmpty}>no variables this step</div>}
        {frame?.vars.map((v) => (
          <div key={v.name} className={s.varRow}>
            <span className={s.varName}>{v.name}</span>
            <span className={s.varValue} style={{ color: v.accent ? accentOf(v.accent) : '#C9CCD2' }}>
              {v.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
