import { arr, combo, mapOf, type Problem, type Tone } from '@/lib/types'

// exactly one pair sums to 21 (12 + 9), as the problem guarantees,
// and it is only found on the last index - which makes for a better trace
const DEMO: [number[], number] = [[5, 3, 8, 12, 1, 9], 21]

export const twoSum: Problem = {
  id: 'two-sum',
  title: 'Two Sum',
  group: 'Array',
  pattern: 'Hash Map',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/two-sum/',
  statement:
    'Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`. Each input has exactly one solution, and you may not use the same element twice.',
  constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Exactly one valid answer exists'],
  signature: {
    fn: 'twoSum',
    params: [
      { name: 'nums', type: 'int[]' },
      { name: 'target', type: 'int' },
    ],
    ret: 'int[]',
  },
  tests: [
    { args: [[2, 7, 11, 15], 9], expect: [0, 1] },
    { args: [[3, 2, 4], 6], expect: [1, 2] },
    { args: [[3, 3], 6], expect: [0, 1] },
    { args: [[5, 3, 8, 12, 1, 9], 21], expect: [3, 5], note: 'answer is the last pair reached' },
    { args: [[-1, -2, -3, -4, -5], -8], expect: [2, 4] },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => i + 1), 2 * n - 1],
  starter: {
    js: `function twoSum(nums, target) {
  // nums: number[], target: number  ->  number[]
}
`,
    cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    // your code here
}
`,
  },

  solutions: [
    // -----------------------------------------------------------------------
    {
      id: 'hash',
      label: 'One-pass hash map',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'Instead of hunting for the partner, remember every number you have already walked past. Then each new number only has to ask one question: have I seen what I need?',
      code: {
        cpp: {
          lines: [
            'vector<int> twoSum(vector<int>& nums, int target) {',
            '    unordered_map<int, int> seen;',
            '    for (int i = 0; i < nums.size(); ++i) {',
            '        int need = target - nums[i];',
            '        auto it = seen.find(need);',
            '        if (it != seen.end()) return {it->second, i};',
            '        seen[nums[i]] = i;',
            '    }',
            '    return {};',
            '}',
          ],
          map: { init: 2, read: 4, check: 5, found: 6, store: 7, done: 9 },
        },
        js: {
          lines: [
            'function twoSum(nums, target) {',
            '  const seen = new Map();',
            '  for (let i = 0; i < nums.length; i++) {',
            '    const need = target - nums[i];',
            '    if (seen.has(need)) {',
            '      return [seen.get(need), i];',
            '    }',
            '    seen.set(nums[i], i);',
            '  }',
            '  return [];',
            '}',
          ],
          map: { init: 2, read: 4, check: 5, found: 6, store: 8, done: 10 },
        },
      },

      trace(t, [nums, target]: [number[], number]) {
        const seen = new Map<number, number>()

        const paint = (i: number, hit: number | null, cursorTone: Tone = 'active') => {
          const tones: Record<number, Tone> = {}
          nums.forEach((_, k) => {
            tones[k] = k < i ? 'done' : k > i ? 'idle' : cursorTone
          })
          if (hit != null) {
            tones[hit] = 'good'
            tones[i] = 'good'
          }
          return combo(
            arr(nums, {
              tones,
              pointers: [{ name: 'i', at: i, accent: 'a' }],
              title: 'nums',
            }),
            mapOf(
              [...seen.entries()].map(([k, v]) => ({
                k,
                v,
                tone: hit != null && seen.get(nums[hit]) === v ? ('good' as Tone) : undefined,
              })),
              { title: 'seen — value to index' },
            ),
          )
        }

        t.push({
          step: 'init',
          note: `The map starts empty. Walking left to right, every number we pass gets remembered, so the answer is always behind us or in front of us — never something we have to search for.`,
          view: paint(0, null, 'idle'),
          vars: [['target', target], ['seen', '{}', 'mute']],
        })

        for (let i = 0; i < nums.length; i++) {
          const x = nums[i]
          const need = target - x
          t.bump()

          t.push({
            step: 'read',
            note: `At index ${i} the value is ${x}. To reach ${target} we would need a ${need} somewhere behind us.`,
            view: paint(i, null),
            vars: [
              ['i', i, 'a'],
              ['nums[i]', x],
              ['need', need, 'c'],
            ],
            badge: { text: `need ${need}`, accent: 'c' },
          })

          if (seen.has(need)) {
            const j = seen.get(need)!
            t.push({
              step: 'found',
              note: `${need} is in the map, stored back at index ${j}. ${nums[j]} + ${x} = ${target}, so the answer is [${j}, ${i}] and we stop — one pass, no second scan.`,
              view: paint(i, j),
              vars: [
                ['i', i, 'a'],
                ['need', need, 'ok'],
                ['answer', `[${j}, ${i}]`, 'ok'],
              ],
              badge: { text: `${nums[j]} + ${x} = ${target}`, accent: 'ok' },
            })
            return
          }

          t.push({
            step: 'check',
            note: `No ${need} in the map yet. That settles this index — nothing before it can pair with ${x}.`,
            view: paint(i, null, 'bad'),
            vars: [
              ['i', i, 'a'],
              ['need', need, 'no'],
            ],
            badge: { text: 'not seen', accent: 'no' },
          })

          seen.set(x, i)
          t.push({
            step: 'store',
            note: `Remember ${x} at index ${i}. It costs O(1) now and saves a whole scan later.`,
            view: paint(i, null, 'done'),
            vars: [
              ['i', i, 'a'],
              ['seen', `${seen.size} entries`],
            ],
          })
        }

        t.push({
          step: 'done',
          note: 'Ran out of array without a match.',
          view: paint(nums.length - 1, null, 'dim'),
          vars: [['answer', '[]', 'no']],
        })
      },

      run([nums, target]: [number[], number], c) {
        const seen = new Map<number, number>()
        for (let i = 0; i < nums.length; i++) {
          c.ops++
          const need = target - nums[i]
          if (seen.has(need)) return [seen.get(need)!, i]
          seen.set(nums[i], i)
        }
        return []
      },
    },

    // -----------------------------------------------------------------------
    {
      id: 'brute',
      label: 'Check every pair',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(1)',
      blurb:
        'The honest first attempt: try every pair until one works. Correct, and hopeless the moment the array gets long.',
      code: {
        cpp: {
          lines: [
            'vector<int> twoSum(vector<int>& nums, int target) {',
            '    int n = nums.size();',
            '    for (int i = 0; i < n; ++i) {',
            '        for (int j = i + 1; j < n; ++j) {',
            '            if (nums[i] + nums[j] == target) return {i, j};',
            '        }',
            '    }',
            '    return {};',
            '}',
          ],
          map: { init: 2, outer: 3, inner: 4, check: 5, found: 5, done: 8 },
        },
        js: {
          lines: [
            'function twoSum(nums, target) {',
            '  const n = nums.length;',
            '  for (let i = 0; i < n; i++) {',
            '    for (let j = i + 1; j < n; j++) {',
            '      if (nums[i] + nums[j] === target) {',
            '        return [i, j];',
            '      }',
            '    }',
            '  }',
            '  return [];',
            '}',
          ],
          map: { init: 2, outer: 3, inner: 4, check: 5, found: 6, done: 10 },
        },
      },

      trace(t, [nums, target]: [number[], number]) {
        const paint = (i: number, j: number | null, hit: boolean) => {
          const tones: Record<number, Tone> = {}
          nums.forEach((_, k) => {
            tones[k] = k < i ? 'dim' : 'idle'
          })
          if (j != null) tones[j] = hit ? 'good' : 'active'
          tones[i] = hit ? 'good' : 'active'
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
          note: 'No memory, no cleverness — pin the first number, then walk every number after it looking for a partner.',
          view: paint(0, null, false),
          vars: [['target', target]],
        })

        for (let i = 0; i < nums.length && !t.full; i++) {
          t.push({
            step: 'outer',
            note: `Pin index ${i} (value ${nums[i]}) and try it against everything to its right.`,
            view: paint(i, null, false),
            vars: [
              ['i', i, 'a'],
              ['nums[i]', nums[i]],
            ],
          })

          for (let j = i + 1; j < nums.length && !t.full; j++) {
            const sum = nums[i] + nums[j]
            t.bump()
            const hit = sum === target

            t.push({
              step: hit ? 'found' : 'check',
              note: hit
                ? `${nums[i]} + ${nums[j]} = ${target}. Found it at [${i}, ${j}] — but only after ${t.ops} pair checks.`
                : `${nums[i]} + ${nums[j]} = ${sum}, which is ${sum < target ? 'short of' : 'past'} ${target}. Try the next j.`,
              view: paint(i, j, hit),
              vars: [
                ['i', i, 'a'],
                ['j', j, 'b'],
                ['sum', sum, hit ? 'ok' : 'no'],
                ['pairs tried', t.ops],
              ],
              badge: {
                text: `${nums[i]} + ${nums[j]} ${hit ? '=' : sum < target ? '<' : '>'} ${target}`,
                accent: hit ? 'ok' : 'no',
              },
            })
            if (hit) return
          }
        }

        t.push({
          step: 'done',
          note: 'Every pair checked, nothing summed to the target.',
          view: paint(0, null, false),
          vars: [['answer', '[]', 'no']],
        })
      },

      run([nums, target]: [number[], number], c) {
        for (let i = 0; i < nums.length; i++) {
          for (let j = i + 1; j < nums.length; j++) {
            c.ops++
            if (nums[i] + nums[j] === target) return [i, j]
          }
        }
        return []
      },
    },
  ],
}
