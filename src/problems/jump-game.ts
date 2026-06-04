import { arr, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[]] = [[2, 3, 1, 1, 4]]

export const jumpGame: Problem = {
  id: 'jump-game',
  title: 'Jump Game',
  group: 'Dynamic Programming',
  pattern: 'Greedy Reach',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/jump-game/',
  statement:
    'You start at index 0; `nums[i]` is the maximum jump length from position `i`. Return `true` if you can reach the last index.',
  constraints: ['1 <= nums.length <= 10^4', '0 <= nums[i] <= 10^5'],
  signature: { fn: 'canJump', params: [{ name: 'nums', type: 'int[]' }], ret: 'bool' },
  tests: [
    { args: [[2, 3, 1, 1, 4]], expect: true },
    { args: [[3, 2, 1, 0, 4]], expect: false, note: 'the zero swallows every route' },
    { args: [[0]], expect: true, note: 'already at the end' },
    { args: [[2, 0, 0]], expect: true },
    { args: [[1, 0, 1]], expect: false },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, () => 1)],
  starter: {
    js: `function canJump(nums) {
  // nums: number[]  ->  boolean
}
`,
    cpp: `bool canJump(vector<int>& nums) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'greedy',
      label: 'Carry the furthest reach',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'You never need the actual route — only the furthest index reachable so far. Walk left to right: if you stand beyond that frontier the answer is no; otherwise extend it with your own jump and keep going.',
      code: {
        cpp: {
          lines: [
            'bool canJump(vector<int>& nums) {',
            '    int reach = 0;',
            '    for (int i = 0; i < nums.size(); ++i) {',
            '        if (i > reach) return false;',
            '        reach = max(reach, i + nums[i]);',
            '    }',
            '    return true;',
            '}',
          ],
          map: { init: 2, stuck: 4, reach: 5, done: 7 },
        },
        js: {
          lines: [
            'function canJump(nums) {',
            '  let reach = 0;',
            '  for (let i = 0; i < nums.length; i++) {',
            '    if (i > reach) return false;',
            '    reach = Math.max(reach, i + nums[i]);',
            '  }',
            '  return true;',
            '}',
          ],
          map: { init: 2, stuck: 4, reach: 5, done: 7 },
        },
      },

      trace(t, [nums]: [number[]]) {
        const n = nums.length
        let reach = 0

        const paint = (i: number, tone: Tone) => {
          const tones: Record<number, Tone> = {}
          for (let k = 0; k < n; k++) {
            tones[k] = k <= reach ? 'band' : 'idle'
          }
          for (let k = 0; k < i; k++) tones[k] = 'done'
          tones[i] = tone
          return arr(nums, {
            tones,
            pointers: [{ name: 'i', at: i, accent: 'a' }],
            band: { from: 0, to: Math.min(reach, n - 1), label: `reach ${reach}`, accent: 'c' },
            title: 'max jump from each index',
          })
        }

        t.push({
          step: 'init',
          note: 'The frontier starts at index 0 — that is all we can reach before taking any jump. Each step either extends it or falls outside it.',
          view: paint(0, 'active'),
          vars: [['reach', 0, 'c']],
        })

        for (let i = 0; i < n; i++) {
          t.bump()
          if (i > reach) {
            t.push({
              step: 'stuck',
              note: `Index ${i} lies beyond the furthest reachable point (${reach}). No sequence of jumps can ever stand here — the gap is unbridgeable. Return false.`,
              view: paint(i, 'bad'),
              vars: [
                ['i', i, 'a'],
                ['reach', reach, 'no'],
                ['answer', 'false', 'no'],
              ],
              badge: { text: `${i} > reach ${reach}`, accent: 'no' },
            })
            return
          }
          const next = Math.max(reach, i + nums[i])
          const extended = next > reach
          reach = next
          t.push({
            step: 'reach',
            note: extended
              ? `From index ${i} a jump of ${nums[i]} pushes the frontier to ${reach}.${reach >= n - 1 ? ' That already covers the last index.' : ''}`
              : `Index ${i} adds nothing new — the frontier stays at ${reach}.`,
            view: paint(i, extended ? 'good' : 'dim'),
            vars: [
              ['i', i, 'a'],
              ['i + nums[i]', i + nums[i]],
              ['reach', reach, extended ? 'ok' : 'mute'],
            ],
            badge: extended ? { text: `reach → ${reach}`, accent: 'ok' } : null,
          })
        }

        t.push({
          step: 'done',
          note: `Walked the whole array without ever standing outside the frontier — the last index is reachable. True.`,
          view: paint(n - 1, 'good'),
          vars: [['answer', 'true', 'ok']],
          badge: { text: 'true', accent: 'ok' },
        })
      },

      run([nums]: [number[]], c) {
        let reach = 0
        for (let i = 0; i < nums.length; i++) {
          c.ops++
          if (i > reach) return false
          reach = Math.max(reach, i + nums[i])
        }
        return true
      },
    },
  ],
}
