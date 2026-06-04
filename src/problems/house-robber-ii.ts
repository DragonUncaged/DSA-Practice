import { arr, bandTones, type Problem } from '@/lib/types'

const DEMO: [number[]] = [[2, 3, 2, 5, 1]]

export const houseRobberII: Problem = {
  id: 'house-robber-ii',
  title: 'House Robber II',
  group: 'Dynamic Programming',
  pattern: 'Take or Skip, on a Circle',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/house-robber-ii/',
  statement:
    'Same as House Robber, but the houses form a circle: the first and last house are neighbours. Return the most you can rob without taking two adjacent houses.',
  constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 1000'],
  signature: { fn: 'rob', params: [{ name: 'nums', type: 'int[]' }], ret: 'int' },
  tests: [
    { args: [[2, 3, 2]], expect: 3, note: 'first and last cannot both be taken' },
    { args: [[1, 2, 3, 1]], expect: 4 },
    { args: [[1, 2, 3]], expect: 3 },
    { args: [[5]], expect: 5, note: 'single house' },
    { args: [[2, 3, 2, 5, 1]], expect: 8 },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => ((i * 31) % 97) + 1)],
  starter: {
    js: `function rob(nums) {
  // nums: number[]  ->  number
}
`,
    cpp: `int rob(vector<int>& nums) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'two-lines',
      label: 'Break the circle into two streets',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'The only new constraint is that house 0 and house n-1 cannot both be robbed. So run the ordinary straight-street solver twice: once excluding the last house, once excluding the first. Every legal plan lives in one of those two worlds.',
      code: {
        cpp: {
          lines: [
            'int rob(vector<int>& nums) {',
            '    int n = nums.size();',
            '    if (n == 1) return nums[0];',
            '    auto line = [&](int lo, int hi) {',
            '        int take = 0, skip = 0;',
            '        for (int i = lo; i < hi; ++i) {',
            '            int t = skip + nums[i];',
            '            skip = max(skip, take);',
            '            take = t;',
            '        }',
            '        return max(take, skip);',
            '    };',
            '    return max(line(0, n - 1), line(1, n));',
            '}',
          ],
          map: { init: 3, phase: 13, decide: 7, done: 13 },
        },
        js: {
          lines: [
            'function rob(nums) {',
            '  if (nums.length === 1) return nums[0];',
            '  const line = (a) => {',
            '    let take = 0;',
            '    let skip = 0;',
            '    for (const x of a) {',
            '      [take, skip] = [skip + x, Math.max(skip, take)];',
            '    }',
            '    return Math.max(take, skip);',
            '  };',
            '  return Math.max(line(nums.slice(0, -1)), line(nums.slice(1)));',
            '}',
          ],
          map: { init: 2, phase: 11, decide: 7, done: 11 },
        },
      },

      trace(t, [nums]: [number[]]) {
        const n = nums.length

        if (n === 1) {
          t.push({
            step: 'init',
            note: 'One house has no neighbours — rob it.',
            view: arr(nums, { tones: { 0: 'good' }, title: 'houses (circular)' }),
            vars: [['answer', nums[0], 'ok']],
          })
          return
        }

        const line = (lo: number, hi: number, label: string): number => {
          let take = 0
          let skip = 0
          t.push({
            step: 'phase',
            note: `${label}: solve the straight street from house ${lo} to ${hi - 1}, ignoring the rest.`,
            view: arr(nums, {
              tones: bandTones(n, lo, hi - 1),
              band: { from: lo, to: hi - 1, label, accent: 'c' },
              title: 'houses (circular)',
            }),
            vars: [['range', `${lo}..${hi - 1}`, 'c']],
          })
          for (let i = lo; i < hi && !t.full; i++) {
            const newTake = skip + nums[i]
            const newSkip = Math.max(skip, take)
            t.bump()
            t.push({
              step: 'decide',
              note: `House ${i} (${nums[i]}): rob for ${newTake} or skip for ${newSkip}.`,
              view: arr(nums, {
                tones: { ...bandTones(n, lo, hi - 1), [i]: newTake >= newSkip ? 'good' : 'bad' },
                pointers: [{ name: 'house', at: i, accent: 'b' }],
                band: { from: lo, to: hi - 1, label, accent: 'c' },
                title: 'houses (circular)',
              }),
              vars: [
                ['house', i, 'b'],
                ['rob it', newTake, newTake >= newSkip ? 'ok' : 'mute'],
                ['skip it', newSkip, newSkip > newTake ? 'ok' : 'mute'],
              ],
              badge: {
                text: newTake >= newSkip ? `rob → ${newTake}` : `skip → ${newSkip}`,
                accent: newTake >= newSkip ? 'ok' : 'b',
              },
            })
            take = newTake
            skip = newSkip
          }
          return Math.max(take, skip)
        }

        const a = line(0, n - 1, 'world A — last house off-limits')
        const b = line(1, n, 'world B — first house off-limits')
        const best = Math.max(a, b)

        t.push({
          step: 'done',
          note: `World A (no last house) yields ${a}; world B (no first house) yields ${b}. Every legal circular plan appears in one of them, so the answer is ${best}.`,
          view: arr(nums, {
            tones: bandTones(n, 0, n - 1, 'good'),
            title: 'houses (circular)',
          }),
          vars: [
            ['world A', a, a >= b ? 'ok' : 'mute'],
            ['world B', b, b > a ? 'ok' : 'mute'],
            ['answer', best, 'ok'],
          ],
          badge: { text: `max ${best}`, accent: 'ok' },
        })
      },

      run([nums]: [number[]], c) {
        const n = nums.length
        if (n === 1) return nums[0]
        const line = (lo: number, hi: number) => {
          let take = 0
          let skip = 0
          for (let i = lo; i < hi; i++) {
            c.ops++
            ;[take, skip] = [skip + nums[i], Math.max(skip, take)]
          }
          return Math.max(take, skip)
        }
        return Math.max(line(0, n - 1), line(1, n))
      },
    },
  ],
}
