'use client'

import { useMemo } from 'react'
import { check } from '@/lib/selfcheck'
import { PROBLEMS } from '@/problems'

export function SelfTest() {
  const rows = useMemo(() => PROBLEMS.flatMap(check), [])
  const practiceOnly = rows.filter((r) => r.practiceOnly && !r.statementOnly && !r.design).length
  const statementOnly = rows.filter((r) => r.statementOnly).length
  const design = rows.filter((r) => r.design).length
  const bad = rows.filter(
    (r) =>
      r.error || (!r.practiceOnly && r.frames === 0) || r.unmappedSteps.length || r.failures.length,
  )

  const cell: React.CSSProperties = {
    padding: '7px 12px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    fontFamily: 'var(--font-mono)',
    fontSize: 11.5,
    verticalAlign: 'top',
  }

  return (
    <div style={{ padding: 28, fontFamily: 'var(--font-sans)' }}>
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>Self test</h1>
      <p style={{ color: bad.length ? '#FF7A59' : '#CDFF57', fontSize: 13, marginBottom: 20 }}>
        {bad.length === 0
          ? `All ${rows.length} solutions across ${PROBLEMS.length} problems are healthy.`
          : `${bad.length} of ${rows.length} solutions have problems.`}
        {practiceOnly > 0 &&
          ` ${practiceOnly} ${practiceOnly === 1 ? 'is' : 'are'} practice-only — tests checked, no trace to check.`}
        {design > 0 &&
          ` ${design} ${design === 1 ? 'is a design problem' : 'are design problems'} — design tests checked, no trace to check.`}
        {statementOnly > 0 && ` ${statementOnly} are statement-only — nothing to run.`}
      </p>

      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ color: '#55585F', textAlign: 'left' }}>
            <th style={cell}>Problem</th>
            <th style={cell}>Solution</th>
            <th style={cell}>Frames</th>
            <th style={cell}>Tests</th>
            <th style={cell}>Growth</th>
            <th style={cell}>Issues</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const issues = [
              r.error,
              !r.practiceOnly && r.frames === 0 ? 'no frames' : null,
              ...r.unmappedSteps.map((u) => `unmapped ${u}`),
              ...r.failures,
            ].filter(Boolean)
            return (
              <tr key={i} style={{ color: issues.length ? '#FF7A59' : '#9A9EA7' }}>
                <td style={cell}>{r.problem}</td>
                <td style={cell}>{r.solution}</td>
                <td style={cell}>
                  {r.statementOnly
                    ? 'statement-only'
                    : r.design
                      ? 'design'
                      : r.practiceOnly
                        ? 'practice-only'
                        : r.frames}
                </td>
                <td style={cell}>
                  {r.statementOnly ? '\u2014' : `${r.testsPassed}/${r.testsTotal}`}
                </td>
                <td style={cell}>{r.growth}</td>
                <td style={{ ...cell, color: issues.length ? '#FF7A59' : '#3B3E44' }}>
                  {issues.length ? issues.join(' · ') : 'ok'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
