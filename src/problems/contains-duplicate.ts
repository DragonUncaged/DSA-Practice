import { arr, combo, mapOf, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[]] = [[4, 7, 2, 9, 7, 5]]

export const containsDuplicate: Problem = {
  id: 'contains-duplicate',
  title: 'Contains Duplicate',
  group: 'Array',
  pattern: 'Hash Set',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/contains-duplicate/',
  statement:
    'Given an integer array `nums`, return `true` if any value appears at least twice, and `false` if every element is distinct.',
  constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
  signature: { fn: 'containsDuplicate', params: [{ name: 'nums', type: 'int[]' }], ret: 'bool' },
  tests: [
    { args: [[1, 2, 3, 1]], expect: true },
    { args: [[1, 2, 3, 4]], expect: false },
    { args: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expect: true },
    { args: [[7]], expect: false, note: 'single element' },
  ],
  demo: DEMO,
  // all distinct: the worst case, where the scan cannot stop early
  scale: (n) => [Array.from({ length: n }, (_, i) => i)],
  starter: {
    js: `function containsDuplicate(nums) {
  // nums: number[]  ->  boolean
}
`,
    cpp: `bool containsDuplicate(vector<int>& nums) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'set',
      label: 'Remember what you have seen',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'A duplicate is just a number you have met before. Keep a set of everything walked past, and each new element asks one O(1) question: am I already in it?',
      code: {
        cpp: {
          lines: [
            'bool containsDuplicate(vector<int>& nums) {',
            '    unordered_set<int> seen;',
            '    for (int x : nums) {',
            '        if (seen.count(x)) return true;',
            '        seen.insert(x);',
            '    }',
            '    return false;',
            '}',
          ],
          map: { init: 2, read: 3, hit: 4, add: 5, done: 7 },
        },
        js: {
          lines: [
            'function containsDuplicate(nums) {',
            '  const seen = new Set();',
            '  for (const x of nums) {',
            '    if (seen.has(x)) return true;',
            '    seen.add(x);',
            '  }',
            '  return false;',
            '}',
          ],
          map: { init: 2, read: 3, hit: 4, add: 5, done: 7 },
        },
      },

      trace(t, [nums]: [number[]]) {
        const n = nums.length
        const seen = new Set<number>()

        const paint = (i: number, tone: Tone, hit?: number) => {
          const tones: Record<number, Tone> = {}
          for (let k = 0; k < n; k++) tones[k] = k < i ? 'done' : k > i ? 'idle' : tone
          if (hit != null) {
            tones[hit] = 'good'
            tones[i] = 'good'
          }
          return combo(
            arr(nums, { tones, pointers: i < n ? [{ name: 'i', at: i, accent: 'a' }] : [], title: 'nums' }),
            mapOf(
              [...seen].map((k) => ({ k, tone: hit != null && k === nums[i] ? ('good' as Tone) : undefined })),
              { title: 'seen', asSet: true },
            ),
          )
        }

        t.push({
          step: 'init',
          note: 'The set starts empty. One pass; each element either trips over the set or joins it.',
          view: paint(0, 'idle'),
          vars: [['seen', '{}', 'mute']],
        })

        for (let i = 0; i < n; i++) {
          const x = nums[i]
          t.bump()

          if (seen.has(x)) {
            const first = nums.indexOf(x)
            t.push({
              step: 'hit',
              note: `${x} is already in the set — it first appeared at index ${first}. That is a duplicate; stop immediately.`,
              view: paint(i, 'good', first),
              vars: [
                ['i', i, 'a'],
                ['nums[i]', x, 'ok'],
                ['answer', 'true', 'ok'],
              ],
              badge: { text: `${x} seen before`, accent: 'ok' },
            })
            return
          }

          t.push({
            step: 'add',
            note: `${x} is new. Add it to the set and move on — the set now vouches for everything behind the pointer.`,
            view: paint(i, 'active'),
            vars: [
              ['i', i, 'a'],
              ['nums[i]', x],
              ['set size', seen.size + 1],
            ],
          })
          seen.add(x)
        }

        t.push({
          step: 'done',
          note: 'Reached the end without a collision — every element is distinct.',
          view: paint(n, 'idle'),
          vars: [['answer', 'false', 'no']],
          badge: { text: 'false', accent: 'no' },
        })
      },

      run([nums]: [number[]], c) {
        const seen = new Set<number>()
        for (const x of nums) {
          c.ops++
          if (seen.has(x)) return true
          seen.add(x)
        }
        return false
      },
    },

    {
      id: 'brute',
      label: 'Compare every pair',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(1)',
      blurb: 'Check each element against everything after it. No memory used, and most of the comparisons are wasted.',
      code: {
        cpp: {
          lines: [
            'bool containsDuplicate(vector<int>& nums) {',
            '    for (int i = 0; i < nums.size(); ++i)',
            '        for (int j = i + 1; j < nums.size(); ++j)',
            '            if (nums[i] == nums[j]) return true;',
            '    return false;',
            '}',
          ],
          map: { init: 2, outer: 2, check: 4, hit: 4, done: 5 },
        },
        js: {
          lines: [
            'function containsDuplicate(nums) {',
            '  for (let i = 0; i < nums.length; i++) {',
            '    for (let j = i + 1; j < nums.length; j++) {',
            '      if (nums[i] === nums[j]) return true;',
            '    }',
            '  }',
            '  return false;',
            '}',
          ],
          map: { init: 2, outer: 2, check: 4, hit: 4, done: 7 },
        },
      },

      trace(t, [nums]: [number[]]) {
        const n = nums.length
        const paint = (i: number, j: number | null, hit: boolean) => {
          const tones: Record<number, Tone> = {}
          for (let k = 0; k < n; k++) tones[k] = k < i ? 'dim' : 'idle'
          tones[i] = hit ? 'good' : 'active'
          if (j != null) tones[j] = hit ? 'good' : 'active'
          return arr(nums, {
            tones,
            pointers: [
              { name: 'i', at: i, accent: 'a' },
              { name: 'j', at: j, accent: 'b', lane: 1 },
            ],
            title: 'nums',
          })
        }

        t.push({
          step: 'init',
          note: 'No memory: pin each element and compare it with everything to its right.',
          view: paint(0, null, false),
          vars: [],
        })

        for (let i = 0; i < n && !t.full; i++) {
          t.push({
            step: 'outer',
            note: `Pin index ${i} (${nums[i]}).`,
            view: paint(i, null, false),
            vars: [['i', i, 'a']],
          })
          for (let j = i + 1; j < n && !t.full; j++) {
            t.bump()
            const hit = nums[i] === nums[j]
            t.push({
              step: hit ? 'hit' : 'check',
              note: hit
                ? `${nums[i]} equals ${nums[j]} — duplicate found after ${t.ops} comparisons.`
                : `${nums[i]} vs ${nums[j]}: different.`,
              view: paint(i, j, hit),
              vars: [
                ['i', i, 'a'],
                ['j', j, 'b'],
                ['comparisons', t.ops],
              ],
              badge: hit ? { text: 'duplicate', accent: 'ok' } : null,
            })
            if (hit) return
          }
        }

        t.push({
          step: 'done',
          note: `All ${t.ops} pairs compared; no duplicate.`,
          view: paint(0, null, false),
          vars: [['answer', 'false', 'no']],
        })
      },

      run([nums]: [number[]], c) {
        for (let i = 0; i < nums.length; i++) {
          for (let j = i + 1; j < nums.length; j++) {
            c.ops++
            if (nums[i] === nums[j]) return true
          }
        }
        return false
      },
    },
  ],
}
