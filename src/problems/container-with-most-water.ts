import { bars, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[]] = [[1, 8, 6, 2, 5, 4, 8, 3, 7]]

export const containerWithMostWater: Problem = {
  id: 'container-with-most-water',
  title: 'Container With Most Water',
  group: 'Array',
  pattern: 'Two Pointers',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/container-with-most-water/',
  statement:
    'You are given an array `height` where each element is the height of a vertical line at that index. Pick two lines that, with the x-axis, form a container holding the most water. Return that maximum amount.',
  constraints: ['2 <= height.length <= 10^5', '0 <= height[i] <= 10^4', 'The container cannot be tilted'],
  signature: { fn: 'maxArea', params: [{ name: 'height', type: 'int[]' }], ret: 'int' },
  tests: [
    { args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expect: 49 },
    { args: [[1, 1]], expect: 1 },
    { args: [[4, 3, 2, 1, 4]], expect: 16 },
    { args: [[1, 2, 1]], expect: 2 },
    { args: [[2, 3, 4, 5, 18, 17, 6]], expect: 17 },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => ((i * 37) % 100) + 1)],
  starter: {
    py: `def maxArea(height):
    # height: list[int]  ->  int
    pass
`,
    js: `function maxArea(height) {
  // height: number[]  ->  number
}
`,
    cpp: `int maxArea(vector<int>& height) {
    // your code here
}
`,
  },

  solutions: [
    // -----------------------------------------------------------------------
    {
      id: 'two-pointers',
      label: 'Two pointers',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Start as wide as possible, then give up width only when you must. The shorter wall is what caps the water, so moving the taller one can never help — which means the shorter one is always safe to discard.',
      code: {
        py: {
          lines: [
            'def maxArea(height):',
            '    l, r = 0, len(height) - 1',
            '    best = 0',
            '    while l < r:',
            '        area = min(height[l], height[r]) * (r - l)',
            '        best = max(best, area)',
            '        if height[l] < height[r]:',
            '            l += 1',
            '        else:',
            '            r -= 1',
            '    return best',
          ],
          map: { init: 2, measure: 5, best: 6, moveL: 8, moveR: 10, done: 11 },
        },
        cpp: {
          lines: [
            'int maxArea(vector<int>& height) {',
            '    int l = 0, r = height.size() - 1, best = 0;',
            '    while (l < r) {',
            '        int area = min(height[l], height[r]) * (r - l);',
            '        best = max(best, area);',
            '        if (height[l] < height[r]) l++;',
            '        else r--;',
            '    }',
            '    return best;',
            '}',
          ],
          map: { init: 2, measure: 4, best: 5, moveL: 6, moveR: 7, done: 9 },
        },
        js: {
          lines: [
            'function maxArea(height) {',
            '  let l = 0, r = height.length - 1, best = 0;',
            '  while (l < r) {',
            '    const area = Math.min(height[l], height[r]) * (r - l);',
            '    best = Math.max(best, area);',
            '    if (height[l] < height[r]) l++;',
            '    else r--;',
            '  }',
            '  return best;',
            '}',
          ],
          map: { init: 2, measure: 4, best: 5, moveL: 6, moveR: 7, done: 9 },
        },
      },

      trace(t, [height]: [number[]]) {
        const n = height.length
        let l = 0
        let r = n - 1
        let best = 0
        let bestPair: [number, number] = [0, n - 1]

        const paint = (
          li: number,
          ri: number,
          opts: { water?: boolean; drop?: number | null; win?: boolean } = {},
        ) => {
          const tones: Record<number, Tone> = {}
          for (let i = 0; i < n; i++) {
            tones[i] = i < li || i > ri ? 'dim' : 'band'
          }
          if (opts.drop != null) tones[opts.drop] = 'bad'
          if (opts.win) {
            tones[li] = 'good'
            tones[ri] = 'good'
          }
          return bars(height, {
            tones,
            pointers: [
              { name: 'l', at: li, accent: 'a' },
              { name: 'r', at: ri, accent: 'b', lane: 1 },
            ],
            fill: opts.water ? { from: li, to: ri, level: Math.min(height[li], height[ri]) } : null,
            title: 'height',
          })
        }

        t.push({
          step: 'init',
          note: 'Begin with the widest possible container — the very first and very last line. Width can only shrink from here, so every later container has to win on height instead.',
          view: paint(l, r),
          vars: [
            ['l', l, 'a'],
            ['r', r, 'b'],
            ['best', 0],
          ],
        })

        while (l < r && !t.full) {
          const lo = Math.min(height[l], height[r])
          const area = lo * (r - l)
          t.bump()

          t.push({
            step: 'measure',
            note: `The water level is capped by the shorter wall, ${lo}. Across a width of ${r - l} that holds ${lo} x ${r - l} = ${area}.`,
            view: paint(l, r, { water: true }),
            vars: [
              ['l', l, 'a'],
              ['r', r, 'b'],
              ['min height', lo],
              ['width', r - l],
              ['area', area, area > best ? 'ok' : 'no'],
              ['best', best],
            ],
            badge: { text: `area ${area}`, accent: area > best ? 'ok' : 'no' },
          })

          if (area > best) {
            best = area
            bestPair = [l, r]
            t.push({
              step: 'best',
              note: `${area} beats the previous best. Record it and keep going.`,
              view: paint(l, r, { water: true, win: true }),
              vars: [
                ['best', best, 'ok'],
                ['at', `[${l}, ${r}]`, 'ok'],
              ],
              badge: { text: `new best ${best}`, accent: 'ok' },
            })
          }

          // The shorter wall is the binding constraint: keeping it can only ever
          // give a narrower container with the same cap. So it is the one to drop.
          if (height[l] < height[r]) {
            t.push({
              step: 'moveL',
              note: `Left wall (${height[l]}) is the shorter one. Keeping it means every future container is narrower and still capped at ${height[l]} — strictly worse. Drop it and move l right.`,
              view: paint(l, r, { drop: l }),
              vars: [
                ['height[l]', height[l], 'a'],
                ['height[r]', height[r], 'b'],
                ['action', 'l++', 'a'],
              ],
              badge: { text: `${height[l]} < ${height[r]}`, accent: 'a' },
            })
            l++
          } else {
            t.push({
              step: 'moveR',
              note: `Right wall (${height[r]}) is no taller. Keeping it can only produce narrower containers with the same cap, so drop it and move r left.`,
              view: paint(l, r, { drop: r }),
              vars: [
                ['height[l]', height[l], 'a'],
                ['height[r]', height[r], 'b'],
                ['action', 'r--', 'b'],
              ],
              badge: { text: `${height[l]} >= ${height[r]}`, accent: 'b' },
            })
            r--
          }
        }

        t.push({
          step: 'done',
          note: `The pointers met. The best container was between index ${bestPair[0]} and ${bestPair[1]}, holding ${best}. Each index was visited once, so this was a single linear sweep.`,
          view: paint(bestPair[0], bestPair[1], { water: true, win: true }),
          vars: [['answer', best, 'ok']],
          badge: { text: `max area ${best}`, accent: 'ok' },
        })
      },

      run([height]: [number[]], c) {
        let l = 0
        let r = height.length - 1
        let best = 0
        while (l < r) {
          c.ops++
          best = Math.max(best, Math.min(height[l], height[r]) * (r - l))
          if (height[l] < height[r]) l++
          else r--
        }
        return best
      },
    },

    // -----------------------------------------------------------------------
    {
      id: 'brute',
      label: 'Every pair of lines',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(1)',
      blurb: 'Measure every possible container and keep the largest. No insight required, and no hope at scale.',
      code: {
        py: {
          lines: [
            'def maxArea(height):',
            '    best = 0',
            '    n = len(height)',
            '    for i in range(n):',
            '        for j in range(i + 1, n):',
            '            area = min(height[i], height[j]) * (j - i)',
            '            best = max(best, area)',
            '    return best',
          ],
          map: { init: 2, outer: 4, measure: 6, best: 7, done: 8 },
        },
        cpp: {
          lines: [
            'int maxArea(vector<int>& height) {',
            '    int best = 0, n = height.size();',
            '    for (int i = 0; i < n; ++i) {',
            '        for (int j = i + 1; j < n; ++j) {',
            '            best = max(best, min(height[i], height[j]) * (j - i));',
            '        }',
            '    }',
            '    return best;',
            '}',
          ],
          map: { init: 2, outer: 3, measure: 5, best: 5, done: 8 },
        },
        js: {
          lines: [
            'function maxArea(height) {',
            '  let best = 0;',
            '  for (let i = 0; i < height.length; i++) {',
            '    for (let j = i + 1; j < height.length; j++) {',
            '      const area = Math.min(height[i], height[j]) * (j - i);',
            '      best = Math.max(best, area);',
            '    }',
            '  }',
            '  return best;',
            '}',
          ],
          map: { init: 2, outer: 3, measure: 5, best: 6, done: 9 },
        },
      },

      trace(t, [height]: [number[]]) {
        const n = height.length
        let best = 0
        let bestPair: [number, number] = [0, 1]

        const paint = (i: number, j: number, win = false) => {
          const tones: Record<number, Tone> = {}
          for (let k = 0; k < n; k++) tones[k] = 'idle'
          tones[i] = win ? 'good' : 'active'
          tones[j] = win ? 'good' : 'active'
          return bars(height, {
            tones,
            pointers: [
              { name: 'i', at: i, accent: 'a' },
              { name: 'j', at: j, accent: 'b', lane: 1 },
            ],
            fill: { from: i, to: j, level: Math.min(height[i], height[j]) },
            title: 'height',
          })
        }

        t.push({
          step: 'init',
          note: 'No shortcut: form every container that exists and measure it.',
          view: paint(0, 1),
          vars: [['best', 0]],
        })

        for (let i = 0; i < n && !t.full; i++) {
          for (let j = i + 1; j < n && !t.full; j++) {
            const area = Math.min(height[i], height[j]) * (j - i)
            t.bump()
            const win = area > best
            if (win) {
              best = area
              bestPair = [i, j]
            }
            t.push({
              step: win ? 'best' : 'measure',
              note: win
                ? `Container (${i}, ${j}) holds ${area} — a new best after ${t.ops} measurements.`
                : `Container (${i}, ${j}) holds ${area}, not better than ${best}.`,
              view: paint(i, j, win),
              vars: [
                ['i', i, 'a'],
                ['j', j, 'b'],
                ['area', area, win ? 'ok' : 'no'],
                ['best', best],
                ['pairs tried', t.ops],
              ],
              badge: { text: `area ${area}`, accent: win ? 'ok' : 'no' },
            })
          }
        }

        t.push({
          step: 'done',
          note: `Best was ${best} between ${bestPair[0]} and ${bestPair[1]} — the same answer the two-pointer scan found, after roughly n^2/2 measurements instead of n.`,
          view: paint(bestPair[0], bestPair[1], true),
          vars: [
            ['answer', best, 'ok'],
            ['pairs tried', t.ops],
          ],
          badge: { text: `max area ${best}`, accent: 'ok' },
        })
      },

      run([height]: [number[]], c) {
        let best = 0
        for (let i = 0; i < height.length; i++) {
          for (let j = i + 1; j < height.length; j++) {
            c.ops++
            best = Math.max(best, Math.min(height[i], height[j]) * (j - i))
          }
        }
        return best
      },
    },
  ],
}
