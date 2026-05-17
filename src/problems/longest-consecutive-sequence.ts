import { arr, combo, mapOf, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[]] = [[100, 4, 200, 1, 3, 2]]

export const longestConsecutiveSequence: Problem = {
  id: 'longest-consecutive-sequence',
  title: 'Longest Consecutive Sequence',
  group: 'Graph',
  pattern: 'Hash Set',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/longest-consecutive-sequence/',
  statement:
    'Given an unsorted array `nums`, return the length of the longest run of consecutive integers present in it (the elements need not be adjacent in the array). Must run in O(n).',
  constraints: ['0 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9', 'O(n) required — no sorting'],
  signature: { fn: 'longestConsecutive', params: [{ name: 'nums', type: 'int[]' }], ret: 'int' },
  tests: [
    { args: [[100, 4, 200, 1, 3, 2]], expect: 4 },
    { args: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expect: 9 },
    { args: [[]], expect: 0, note: 'empty' },
    { args: [[5, 5, 5]], expect: 1, note: 'duplicates collapse' },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => (i * 2) % n)],
  starter: {
    py: `def longestConsecutive(nums):
    # nums: list[int]  ->  int
    pass
`,
    js: `function longestConsecutive(nums) {
  // nums: number[]  ->  number
}
`,
    cpp: `int longestConsecutive(vector<int>& nums) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'set',
      label: 'Only start counting at run starts',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'Dump everything into a set. A number begins a run only if number-1 is absent — so only run starts pay for a walk, and each element is stepped over exactly once across all walks. That single observation is what beats sorting.',
      code: {
        py: {
          lines: [
            'def longestConsecutive(nums):',
            '    s = set(nums)',
            '    best = 0',
            '    for x in s:',
            '        if x - 1 in s:',
            '            continue',
            '        end = x',
            '        while end + 1 in s:',
            '            end += 1',
            '        best = max(best, end - x + 1)',
            '    return best',
          ],
          map: { init: 2, skip: 6, start: 7, walk: 9, best: 10, done: 11 },
        },
        cpp: {
          lines: [
            'int longestConsecutive(vector<int>& nums) {',
            '    unordered_set<int> s(nums.begin(), nums.end());',
            '    int best = 0;',
            '    for (int x : s) {',
            '        if (s.count(x - 1)) continue;',
            '        int end = x;',
            '        while (s.count(end + 1)) end++;',
            '        best = max(best, end - x + 1);',
            '    }',
            '    return best;',
            '}',
          ],
          map: { init: 2, skip: 5, start: 6, walk: 7, best: 8, done: 10 },
        },
        js: {
          lines: [
            'function longestConsecutive(nums) {',
            '  const s = new Set(nums);',
            '  let best = 0;',
            '  for (const x of s) {',
            '    if (s.has(x - 1)) continue;',
            '    let end = x;',
            '    while (s.has(end + 1)) end++;',
            '    best = Math.max(best, end - x + 1);',
            '  }',
            '  return best;',
            '}',
          ],
          map: { init: 2, skip: 5, start: 6, walk: 7, best: 8, done: 10 },
        },
      },

      trace(t, [nums]: [number[]]) {
        const s = new Set(nums)
        const items = [...s]
        let best = 0

        const view = (focus: number | null, run: number[], tone: Tone) =>
          combo(
            arr(nums, { title: 'nums (as given)', tones: {} }),
            mapOf(
              items.map((k) => ({
                k,
                tone: run.includes(k) ? ('good' as Tone) : k === focus ? tone : undefined,
              })),
              { title: 'the set', asSet: true },
            ),
          )

        t.push({
          step: 'init',
          note: `Everything goes into a set — duplicates vanish and membership checks become O(1). ${s.size} distinct values.`,
          view: view(null, [], 'idle'),
          vars: [['set size', s.size]],
        })

        for (const x of items) {
          t.bump()
          if (s.has(x - 1)) {
            t.push({
              step: 'skip',
              note: `${x} has a left neighbour (${x - 1}) in the set, so it sits in the middle of some run. Whoever starts that run will count it — skip.`,
              view: view(x, [], 'dim'),
              vars: [
                ['x', x, 'mute'],
                ['x - 1 present', 'yes', 'no'],
              ],
            })
            continue
          }

          t.push({
            step: 'start',
            note: `${x - 1} is absent, so ${x} is the start of a run. Walk upward to see how far it goes.`,
            view: view(x, [x], 'active'),
            vars: [['run start', x, 'c']],
            badge: { text: `run starts at ${x}`, accent: 'c' },
          })

          let end = x
          const run = [x]
          while (s.has(end + 1) && !t.full) {
            end++
            run.push(end)
            t.bump()
            t.push({
              step: 'walk',
              note: `${end} is in the set — the run extends to ${run.length} numbers (${x}..${end}).`,
              view: view(null, run, 'active'),
              vars: [
                ['run', `${x}..${end}`, 'c'],
                ['length', run.length, 'ok'],
              ],
            })
          }

          if (end - x + 1 > best) {
            best = end - x + 1
            t.push({
              step: 'best',
              note: `Run ${x}..${end} has length ${best} — the longest so far.`,
              view: view(null, run, 'good'),
              vars: [['best', best, 'ok']],
              badge: { text: `best ${best}`, accent: 'ok' },
            })
          }
        }

        t.push({
          step: 'done',
          note: `Longest consecutive run: ${best}. Every number was stepped over at most twice — once by the outer loop, once inside a walk — so the whole thing is linear despite the nested look.`,
          view: view(null, [], 'idle'),
          vars: [['answer', best, 'ok']],
          badge: { text: `length ${best}`, accent: 'ok' },
        })
      },

      run([nums]: [number[]], c) {
        const s = new Set(nums)
        let best = 0
        for (const x of s) {
          c.ops++
          if (s.has(x - 1)) continue
          let end = x
          while (s.has(end + 1)) {
            c.ops++
            end++
          }
          best = Math.max(best, end - x + 1)
        }
        return best
      },
    },
  ],
}
