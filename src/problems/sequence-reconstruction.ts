import type { Problem } from '@/lib/types'

export const sequenceReconstruction: Problem = {
  id: 'sequence-reconstruction',
  title: 'Sequence Reconstruction',
  group: 'Medium',
  pattern: 'Topological Sort',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/sequence-reconstruction/',
  statement:
    'Given a permutation `nums` of `1..n` and a list of `sequences`, each a subsequence of `nums`, return true when `nums` is the one and only shortest sequence that has all of them as subsequences.',
  constraints: [
    '1 <= nums.length <= 10^4',
    'nums is a permutation of 1..n',
    '1 <= sequences.length <= 10^4',
    'The total length of all sequences is at most 10^5',
    'Each sequences[i] is a subsequence of nums',
  ],
  signature: {
    fn: 'sequenceReconstruction',
    params: [
      { name: 'nums', type: 'int[]' },
      { name: 'sequences', type: 'int[][]' },
    ],
    ret: 'bool',
  },
  tests: [
    { args: [[1, 2, 3], [[1, 2], [1, 3]]], expect: false, note: '[1,3,2] works too' },
    { args: [[1, 2, 3], [[1, 2]]], expect: false, note: '[1,2] is shorter' },
    { args: [[1, 2, 3], [[1, 2], [1, 3], [2, 3]]], expect: true },
    { args: [[1], [[1]]], expect: true, note: 'one element, nothing to order' },
    { args: [[1, 2], [[1, 2]]], expect: true },
    { args: [[1, 2, 3], [[3, 2]]], expect: false, note: 'contradicts the given order' },
    {
      args: [[4, 1, 5, 2, 6, 3], [[5, 2, 6, 3], [4, 1, 5, 2]]],
      expect: true,
      note: 'every neighbouring pair is pinned down',
    },
  ],
  demo: [[1, 2, 3], [[1, 2], [1, 3], [2, 3]]],
  starter: {
    js: `function sequenceReconstruction(nums, sequences) {
  // nums: number[], sequences: number[][]  ->  boolean
}
`,
    cpp: `bool sequenceReconstruction(vector<int>& nums, vector<vector<int>>& sequences) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'adjacent-pairs',
      label: 'Every neighbouring pair has to be witnessed',
      kind: 'optimal',
      time: 'O(total length)',
      space: 'O(n)',
      blurb:
        'A full topological sort is more machinery than this needs. `nums` is the unique answer exactly when two things hold: no pair in any sequence contradicts the order in `nums`, and every one of the `n - 1` neighbouring pairs of `nums` appears back to back somewhere — otherwise those two values could be swapped freely.',
      code: {
        cpp: {
          lines: [
            'bool sequenceReconstruction(vector<int>& nums, vector<vector<int>>& sequences) {',
            '    if (sequences.empty()) return false;',
            '    int n = nums.size();',
            '    vector<int> at(n + 1, -1);',
            '    for (int i = 0; i < n; ++i) at[nums[i]] = i;',
            '',
            '    vector<bool> pinned(n + 1, false);',
            '    int missing = n - 1;',
            '    for (auto& seq : sequences) {',
            '        for (size_t i = 1; i < seq.size(); ++i) {',
            '            int a = seq[i - 1], b = seq[i];',
            '            if (at[a] >= at[b]) return false;',
            '            if (!pinned[a] && at[a] + 1 == at[b]) { pinned[a] = true; --missing; }',
            '        }',
            '    }',
            '    return missing == 0;',
            '}',
          ],
        },
        js: {
          lines: [
            'function sequenceReconstruction(nums, sequences) {',
            '  if (sequences.length === 0) return false;',
            '  const n = nums.length;',
            '  const at = new Array(n + 1).fill(-1);',
            '  nums.forEach((v, i) => { at[v] = i; });',
            '',
            '  const pinned = new Array(n + 1).fill(false);',
            '  let missing = n - 1;',
            '  for (const seq of sequences) {',
            '    for (let i = 1; i < seq.length; i++) {',
            '      const a = seq[i - 1];',
            '      const b = seq[i];',
            '      if (at[a] >= at[b]) return false;',
            '      if (!pinned[a] && at[a] + 1 === at[b]) { pinned[a] = true; missing--; }',
            '    }',
            '  }',
            '  return missing === 0;',
            '}',
          ],
        },
      },

      run([nums, sequences]: [number[], number[][]], c) {
        if (sequences.length === 0) return false
        const n = nums.length
        const at = new Array<number>(n + 1).fill(-1)
        nums.forEach((v, i) => {
          at[v] = i
        })
        const pinned = new Array<boolean>(n + 1).fill(false)
        let missing = n - 1
        for (const seq of sequences) {
          for (let i = 1; i < seq.length; i++) {
            c.ops++
            const a = seq[i - 1]
            const b = seq[i]
            if (at[a] >= at[b]) return false
            if (!pinned[a] && at[a] + 1 === at[b]) {
              pinned[a] = true
              missing--
            }
          }
        }
        return missing === 0
      },
    },
  ],
}
