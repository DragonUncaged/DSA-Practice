import { arr, combo, mapOf, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[], number] = [[1, 1, 1, 2, 2, 3, 3, 3, 3], 2]

export const topKFrequentElements: Problem = {
  id: 'top-k-frequent-elements',
  title: 'Top K Frequent Elements',
  group: 'Heap',
  pattern: 'Bucket by Frequency',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/top-k-frequent-elements/',
  statement: 'Return the `k` most frequent elements of `nums`, in any order. Aim to beat O(n log n).',
  constraints: ['1 <= nums.length <= 10^5', 'The answer is guaranteed unique'],
  signature: {
    fn: 'topKFrequent',
    params: [
      { name: 'nums', type: 'int[]' },
      { name: 'k', type: 'int' },
    ],
    ret: 'int[]',
  },
  compare: 'set',
  tests: [
    { args: [[1, 1, 1, 2, 2, 3], 2], expect: [1, 2] },
    { args: [[1], 1], expect: [1] },
    { args: [[4, 4, 4, 5, 5, 6], 1], expect: [4] },
    { args: [[7, 7, 8, 8, 9], 2], expect: [7, 8] },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => i % Math.max(2, Math.floor(n / 8))), 3],
  starter: {
    py: `def topKFrequent(nums, k):
    # nums: list[int], k: int  ->  list[int]
    pass
`,
    js: `function topKFrequent(nums, k) {
  // nums: number[], k: number  ->  number[]
}
`,
    cpp: `vector<int> topKFrequent(vector<int>& nums, int k) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'bucket',
      label: 'Buckets indexed by count',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'A frequency can never exceed n, so make n+1 buckets and drop each value into the bucket of its count. Reading the buckets from the top down yields the most frequent elements with no heap and no sort — the array index does the ordering.',
      code: {
        py: {
          lines: [
            'def topKFrequent(nums, k):',
            '    count = {}',
            '    for x in nums:',
            '        count[x] = count.get(x, 0) + 1',
            '    buckets = [[] for _ in range(len(nums) + 1)]',
            '    for x, f in count.items():',
            '        buckets[f].append(x)',
            '    out = []',
            '    for f in range(len(nums), 0, -1):',
            '        for x in buckets[f]:',
            '            out.append(x)',
            '            if len(out) == k:',
            '                return out',
            '    return out',
          ],
          map: { count: 4, drop: 7, sweep: 11, done: 14 },
        },
        cpp: {
          lines: [
            'vector<int> topKFrequent(vector<int>& nums, int k) {',
            '    unordered_map<int, int> count;',
            '    for (int x : nums) count[x]++;',
            '    vector<vector<int>> buckets(nums.size() + 1);',
            '    for (auto& [x, f] : count) buckets[f].push_back(x);',
            '    vector<int> out;',
            '    for (int f = nums.size(); f > 0 && out.size() < k; --f)',
            '        for (int x : buckets[f])',
            '            if (out.size() < k) out.push_back(x);',
            '    return out;',
            '}',
          ],
          map: { count: 3, drop: 5, sweep: 9, done: 10 },
        },
        js: {
          lines: [
            'function topKFrequent(nums, k) {',
            '  const count = new Map();',
            '  for (const x of nums) count.set(x, (count.get(x) ?? 0) + 1);',
            '  const buckets = Array.from({ length: nums.length + 1 }, () => []);',
            '  for (const [x, f] of count) buckets[f].push(x);',
            '  const out = [];',
            '  for (let f = nums.length; f > 0 && out.length < k; f--) {',
            '    for (const x of buckets[f]) {',
            '      if (out.length < k) out.push(x);',
            '    }',
            '  }',
            '  return out;',
            '}',
          ],
          map: { count: 3, drop: 5, sweep: 9, done: 13 },
        },
      },

      trace(t, [nums, k]: [number[], number]) {
        const count = new Map<number, number>()
        for (const x of nums) count.set(x, (count.get(x) ?? 0) + 1)
        const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => [])
        const out: number[] = []

        const view = (hotF: number | null, tone: Tone) =>
          combo(
            arr(nums, { title: 'nums' }),
            mapOf(
              [...count.entries()].map(([x, f]) => ({ k: x, v: `${f}x`, tone: out.includes(x) ? ('good' as Tone) : undefined })),
              { title: 'frequencies' },
            ),
            mapOf(
              buckets
                .map((b, f) => ({ f, b }))
                .filter(({ b }) => b.length)
                .reverse()
                .map(({ f, b }) => ({
                  k: `count ${f}`,
                  v: b.join(', '),
                  tone: f === hotF ? tone : ('band' as Tone),
                })),
              { title: 'buckets, highest count first' },
            ),
          )

        t.push({
          step: 'count',
          note: `Tally each value: ${[...count.entries()].map(([x, f]) => `${x} appears ${f}x`).join(', ')}.`,
          view: view(null, 'idle'),
          vars: [
            ['distinct', count.size],
            ['k', k, 'c'],
          ],
        })

        for (const [x, f] of count) {
          buckets[f].push(x)
          t.bump()
        }
        t.push({
          step: 'drop',
          note: `Drop each value into bucket[frequency]. Sorting by count now costs nothing — the bucket index already is the count, and no count can exceed ${nums.length}.`,
          view: view(null, 'idle'),
          vars: [['buckets used', buckets.filter((b) => b.length).length, 'c']],
          badge: { text: 'bucketed', accent: 'c' },
        })

        for (let f = nums.length; f > 0 && out.length < k && !t.full; f--) {
          for (const x of buckets[f]) {
            if (out.length >= k) break
            out.push(x)
            t.bump()
            t.push({
              step: 'sweep',
              note: `Sweeping from the top: bucket ${f} yields ${x} — pick ${out.length} of ${k}.`,
              view: view(f, 'good'),
              vars: [
                ['from bucket', f, 'b'],
                ['picked', x, 'ok'],
                ['progress', `${out.length} / ${k}`],
              ],
              badge: { text: `pick ${x} (${f}x)`, accent: 'ok' },
            })
          }
        }

        t.push({
          step: 'done',
          note: `Top ${k}: [${out.join(', ')}]. Counting was linear, bucketing was linear, and the sweep stopped after ${k} picks — no O(n log n) sort anywhere.`,
          view: view(null, 'idle'),
          vars: [['answer', `[${out.join(', ')}]`, 'ok']],
          badge: { text: `[${out.join(', ')}]`, accent: 'ok' },
        })
      },

      run([nums, k]: [number[], number], c) {
        const count = new Map<number, number>()
        for (const x of nums) {
          c.ops++
          count.set(x, (count.get(x) ?? 0) + 1)
        }
        const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => [])
        for (const [x, f] of count) {
          c.ops++
          buckets[f].push(x)
        }
        const out: number[] = []
        for (let f = nums.length; f > 0 && out.length < k; f--) {
          for (const x of buckets[f]) {
            c.ops++
            if (out.length < k) out.push(x)
          }
        }
        return out
      },
    },
  ],
}
