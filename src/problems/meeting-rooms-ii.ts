import { arr, combo, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[][]] = [[[0, 30], [5, 10], [15, 20], [8, 25]]]

const cell = (iv: number[]) => `${iv[0]}–${iv[1]}`

export const meetingRoomsII: Problem = {
  id: 'meeting-rooms-ii',
  title: 'Meeting Rooms II',
  group: 'Interval',
  pattern: 'Two Sorted Sweeps',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/meeting-rooms-ii/',
  statement: 'Given meeting `intervals`, return the minimum number of conference rooms required to host them all.',
  constraints: ['1 <= intervals.length <= 10^4', 'start < end'],
  signature: { fn: 'minMeetingRooms', params: [{ name: 'intervals', type: 'int[][]' }], ret: 'int' },
  tests: [
    { args: [[[0, 30], [5, 10], [15, 20]]], expect: 2 },
    { args: [[[7, 10], [2, 4]]], expect: 1 },
    { args: [[[1, 5], [5, 8]]], expect: 1, note: 'a room frees up exactly in time' },
    { args: [[[0, 30], [5, 10], [15, 20], [8, 25]]], expect: 3 },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => [i, i + 3])],
  starter: {
    js: `function minMeetingRooms(intervals) {
  // intervals: number[][]  ->  number
}
`,
    cpp: `int minMeetingRooms(vector<vector<int>>& intervals) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'two-pointer',
      label: 'Separate the starts from the ends',
      kind: 'optimal',
      time: 'O(n log n)',
      space: 'O(n)',
      blurb:
        'Rooms only change hands at a start or an end. Sort all starts and all ends separately, then walk time forward: a start before the next end needs one more room; a start at-or-after it reuses a freed one. The peak of that counter is the answer.',
      code: {
        cpp: {
          lines: [
            'int minMeetingRooms(vector<vector<int>>& intervals) {',
            '    vector<int> starts, ends;',
            '    for (auto& iv : intervals) { starts.push_back(iv[0]); ends.push_back(iv[1]); }',
            '    sort(starts.begin(), starts.end());',
            '    sort(ends.begin(), ends.end());',
            '    int rooms = 0, peak = 0, e = 0;',
            '    for (int s : starts) {',
            '        if (s < ends[e]) peak = max(peak, ++rooms);',
            '        else e++;',
            '    }',
            '    return peak;',
            '}',
          ],
          map: { init: 5, open: 8, reuse: 9, done: 11 },
        },
        js: {
          lines: [
            'function minMeetingRooms(intervals) {',
            '  const starts = intervals.map((iv) => iv[0]).sort((a, b) => a - b);',
            '  const ends = intervals.map((iv) => iv[1]).sort((a, b) => a - b);',
            '  let rooms = 0;',
            '  let peak = 0;',
            '  let e = 0;',
            '  for (const s of starts) {',
            '    if (s < ends[e]) {',
            '      rooms++;',
            '      peak = Math.max(peak, rooms);',
            '    } else {',
            '      e++;',
            '    }',
            '  }',
            '  return peak;',
            '}',
          ],
          map: { init: 3, open: 9, reuse: 12, done: 15 },
        },
      },

      trace(t, [intervals]: [number[][]]) {
        const starts = intervals.map((iv) => iv[0]).sort((a, b) => a - b)
        const ends = intervals.map((iv) => iv[1]).sort((a, b) => a - b)
        const n = starts.length
        let rooms = 0
        let peak = 0
        let e = 0

        const paint = (si: number, tone: Tone) => {
          const sTones: Record<number, Tone> = {}
          const eTones: Record<number, Tone> = {}
          for (let k = 0; k < n; k++) {
            sTones[k] = k < si ? 'done' : k === si ? tone : 'idle'
            eTones[k] = k < e ? 'done' : k === e ? 'band' : 'idle'
          }
          return combo(
            arr(starts, { tones: sTones, pointers: si < n ? [{ name: 's', at: si, accent: 'a' }] : [], title: 'meeting starts (sorted)' }),
            arr(ends, { tones: eTones, pointers: e < n ? [{ name: 'e', at: e, accent: 'b' }] : [], title: 'meeting ends (sorted)' }),
          )
        }

        t.push({
          step: 'init',
          note: `Meetings: ${intervals.map(cell).join(', ')}. Which meeting a room hosts never matters — only how many are running at once. So split into sorted starts and sorted ends and walk time forward.`,
          view: paint(0, 'idle'),
          vars: [
            ['rooms in use', 0],
            ['peak', 0],
          ],
        })

        for (let si = 0; si < n && !t.full; si++) {
          const s = starts[si]
          t.bump()
          if (s < ends[e]) {
            rooms++
            peak = Math.max(peak, rooms)
            t.push({
              step: 'open',
              note: `A meeting starts at ${s} while the earliest running one ends at ${ends[e]} — nothing has freed up, so open room #${rooms}.${peak === rooms ? ` New peak: ${peak}.` : ''}`,
              view: paint(si, 'bad'),
              vars: [
                ['start', s, 'a'],
                ['next end', ends[e], 'b'],
                ['rooms in use', rooms, 'no'],
                ['peak', peak, 'c'],
              ],
              badge: { text: `${rooms} rooms open`, accent: 'no' },
            })
          } else {
            e++
            t.push({
              step: 'reuse',
              note: `A meeting starts at ${s}, and one already ended at ${ends[e - 1]} — reuse that room. Count stays at ${rooms}.`,
              view: paint(si, 'good'),
              vars: [
                ['start', s, 'a'],
                ['freed at', ends[e - 1], 'ok'],
                ['rooms in use', rooms],
              ],
              badge: { text: 'reuse a room', accent: 'ok' },
            })
          }
        }

        t.push({
          step: 'done',
          note: `The counter peaked at ${peak} — that many rooms are unavoidable, and that many suffice.`,
          view: paint(n, 'idle'),
          vars: [['answer', peak, 'ok']],
          badge: { text: `${peak} rooms`, accent: 'ok' },
        })
      },

      run([intervals]: [number[][]], c) {
        const starts = intervals.map((iv) => iv[0]).sort((a, b) => a - b)
        const ends = intervals.map((iv) => iv[1]).sort((a, b) => a - b)
        let rooms = 0
        let peak = 0
        let e = 0
        for (const s of starts) {
          c.ops++
          if (s < ends[e]) peak = Math.max(peak, ++rooms)
          else e++
        }
        return peak
      },
    },
  ],
}
