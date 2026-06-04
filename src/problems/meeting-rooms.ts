import { arr, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[][]] = [[[0, 30], [5, 10], [15, 20]]]

const cell = (iv: number[]) => `${iv[0]}–${iv[1]}`

export const meetingRooms: Problem = {
  id: 'meeting-rooms',
  title: 'Meeting Rooms',
  group: 'Interval',
  pattern: 'Sort + Adjacent Check',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/meeting-rooms/',
  statement:
    'Given an array of meeting `intervals`, return `true` if one person could attend all of them — that is, no two meetings overlap.',
  constraints: ['0 <= intervals.length <= 10^4', 'start < end'],
  signature: { fn: 'canAttendMeetings', params: [{ name: 'intervals', type: 'int[][]' }], ret: 'bool' },
  tests: [
    { args: [[[0, 30], [5, 10], [15, 20]]], expect: false },
    { args: [[[7, 10], [2, 4]]], expect: true },
    { args: [[]], expect: true, note: 'no meetings at all' },
    { args: [[[1, 5], [5, 8]]], expect: true, note: 'back-to-back is fine' },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => [i * 3, i * 3 + 2])],
  starter: {
    js: `function canAttendMeetings(intervals) {
  // intervals: number[][]  ->  boolean
}
`,
    cpp: `bool canAttendMeetings(vector<vector<int>>& intervals) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'sort',
      label: 'Sort, then check neighbours only',
      kind: 'optimal',
      time: 'O(n log n)',
      space: 'O(1)',
      blurb:
        'After sorting by start time, any conflict must be between neighbours — if meeting 3 collides with meeting 1, it collides with meeting 2 as well. So one linear scan of adjacent pairs settles it.',
      code: {
        cpp: {
          lines: [
            'bool canAttendMeetings(vector<vector<int>>& intervals) {',
            '    sort(intervals.begin(), intervals.end());',
            '    for (int i = 1; i < intervals.size(); ++i)',
            '        if (intervals[i][0] < intervals[i - 1][1]) return false;',
            '    return true;',
            '}',
          ],
          map: { init: 2, check: 4, clash: 4, done: 5 },
        },
        js: {
          lines: [
            'function canAttendMeetings(intervals) {',
            '  intervals.sort((a, b) => a[0] - b[0]);',
            '  for (let i = 1; i < intervals.length; i++) {',
            '    if (intervals[i][0] < intervals[i - 1][1]) return false;',
            '  }',
            '  return true;',
            '}',
          ],
          map: { init: 2, check: 4, clash: 4, done: 6 },
        },
      },

      trace(t, [input]: [number[][]]) {
        const sorted = input.map((iv) => [...iv]).sort((a, b) => a[0] - b[0])
        const n = sorted.length

        const paint = (i: number | null, tone: Tone) => {
          const tones: Record<number, Tone> = {}
          for (let k = 0; k < n; k++) tones[k] = i == null ? 'done' : k < i - 1 ? 'done' : 'idle'
          if (i != null && i > 0) {
            tones[i - 1] = tone
            tones[i] = tone
          }
          return arr(sorted.map(cell), {
            tones,
            title: 'meetings sorted by start',
          })
        }

        if (n === 0) {
          t.push({
            step: 'done',
            note: 'No meetings: trivially attendable.',
            view: arr(['—'], { title: 'meetings' }),
            vars: [['answer', 'true', 'ok']],
          })
          return
        }

        t.push({
          step: 'init',
          note: `Sorted by start: ${sorted.map(cell).join(', ')}. Only adjacent pairs can be the first conflict, so only adjacent pairs need checking.`,
          view: paint(null, 'idle'),
          vars: [['meetings', n]],
        })

        for (let i = 1; i < n && !t.full; i++) {
          t.bump()
          const clash = sorted[i][0] < sorted[i - 1][1]
          if (clash) {
            t.push({
              step: 'clash',
              note: `${cell(sorted[i])} starts at ${sorted[i][0]}, but ${cell(sorted[i - 1])} runs until ${sorted[i - 1][1]} — they overlap. One person cannot attend both. False.`,
              view: paint(i, 'bad'),
              vars: [
                ['pair', `${cell(sorted[i - 1])} vs ${cell(sorted[i])}`, 'no'],
                ['answer', 'false', 'no'],
              ],
              badge: { text: 'overlap', accent: 'no' },
            })
            return
          }
          t.push({
            step: 'check',
            note: `${cell(sorted[i - 1])} ends at ${sorted[i - 1][1]}; ${cell(sorted[i])} starts at ${sorted[i][0]} — no overlap. Continue.`,
            view: paint(i, 'good'),
            vars: [['pair', `${cell(sorted[i - 1])} → ${cell(sorted[i])}`, 'ok']],
          })
        }

        t.push({
          step: 'done',
          note: 'Every adjacent pair is compatible, so the whole calendar is. True.',
          view: paint(null, 'good'),
          vars: [['answer', 'true', 'ok']],
          badge: { text: 'true', accent: 'ok' },
        })
      },

      run([input]: [number[][]], c) {
        const sorted = input.map((iv) => [...iv]).sort((a, b) => a[0] - b[0])
        for (let i = 1; i < sorted.length; i++) {
          c.ops++
          if (sorted[i][0] < sorted[i - 1][1]) return false
        }
        return true
      },
    },
  ],
}
