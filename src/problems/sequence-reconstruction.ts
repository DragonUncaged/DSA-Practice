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
    { args: [[1, 2, 3], [[1, 2], [2, 3], [1, 2, 3]]], expect: true, note: 'redundant sequences are fine' },
    { args: [[1, 2, 3, 4], [[1, 2], [3, 4]]], expect: false, note: '2 and 3 are never ordered' },
    { args: [[2, 1], [[2, 1], [1]]], expect: true, note: 'a one-element sequence adds nothing' },
  ],
  scale: (n) => [
    Array.from({ length: n }, (_, i) => i + 1),
    Array.from({ length: n - 1 }, (_, i) => [i + 1, i + 2]),
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
      id: 'topological-sort',
      label: 'Topologically sort and demand a unique order',
      kind: 'brute',
      time: 'O(n + total length)',
      space: 'O(n + total length)',
      blurb:
        'Turn every neighbouring pair inside the sequences into a directed edge and run Kahn\'s algorithm. The reconstruction is unique only if exactly one value has no remaining predecessor at every step; if that sequence of forced picks is `nums` itself, the answer is yes. Correct, and the general tool — a graph, in-degrees and a queue — for a question that turns out to need none of it.',
      code: {
        cpp: {
          lines: [
            'bool sequenceReconstruction(vector<int>& nums, vector<vector<int>>& sequences) {',
            '    int n = nums.size();',
            '    vector<vector<int>> next(n + 1);',
            '    vector<int> indeg(n + 1, 0);',
            '    vector<bool> seen(n + 1, false);',
            '    for (auto& seq : sequences) {',
            '        for (int v : seq) { if (v < 1 || v > n) return false; seen[v] = true; }',
            '        for (size_t i = 1; i < seq.size(); ++i) { next[seq[i - 1]].push_back(seq[i]); indeg[seq[i]]++; }',
            '    }',
            '    for (int v = 1; v <= n; ++v) if (!seen[v]) return false;',
            '    queue<int> q;',
            '    for (int v = 1; v <= n; ++v) if (indeg[v] == 0) q.push(v);',
            '    int at = 0;',
            '    while (!q.empty()) {',
            '        if (q.size() > 1) return false;  // two choices: not unique',
            '        int v = q.front(); q.pop();',
            '        if (at == n || nums[at++] != v) return false;',
            '        for (int w : next[v]) if (--indeg[w] == 0) q.push(w);',
            '    }',
            '    return at == n;',
            '}',
          ],
        },
        js: {
          lines: [
            'function sequenceReconstruction(nums, sequences) {',
            '  const n = nums.length;',
            '  const next = Array.from({ length: n + 1 }, () => []);',
            '  const indeg = new Array(n + 1).fill(0);',
            '  const seen = new Array(n + 1).fill(false);',
            '  for (const seq of sequences) {',
            '    for (const v of seq) {',
            '      if (v < 1 || v > n) return false;',
            '      seen[v] = true;',
            '    }',
            '    for (let i = 1; i < seq.length; i++) { next[seq[i - 1]].push(seq[i]); indeg[seq[i]]++; }',
            '  }',
            '  for (let v = 1; v <= n; v++) if (!seen[v]) return false;',
            '',
            '  const queue = [];',
            '  for (let v = 1; v <= n; v++) if (indeg[v] === 0) queue.push(v);',
            '  let at = 0;',
            '  while (queue.length) {',
            '    if (queue.length > 1) return false; // two choices: not unique',
            '    const v = queue.shift();',
            '    if (at === n || nums[at++] !== v) return false;',
            '    for (const w of next[v]) if (--indeg[w] === 0) queue.push(w);',
            '  }',
            '  return at === n;',
            '}',
          ],
        },
      },

      run([nums, sequences]: [number[], number[][]], c) {
        const n = nums.length
        const next: number[][] = Array.from({ length: n + 1 }, () => [])
        const indeg = new Array<number>(n + 1).fill(0)
        const seen = new Array<boolean>(n + 1).fill(false)
        for (const seq of sequences) {
          for (const v of seq) {
            c.ops++
            if (v < 1 || v > n) return false
            seen[v] = true
          }
          for (let i = 1; i < seq.length; i++) {
            next[seq[i - 1]].push(seq[i])
            indeg[seq[i]]++
          }
        }
        for (let v = 1; v <= n; v++) if (!seen[v]) return false
        const queue: number[] = []
        for (let v = 1; v <= n; v++) if (indeg[v] === 0) queue.push(v)
        let at = 0
        let head = 0
        while (head < queue.length) {
          c.ops++
          if (queue.length - head > 1) return false
          const v = queue[head++]
          if (at === n || nums[at++] !== v) return false
          for (const w of next[v]) if (--indeg[w] === 0) queue.push(w)
        }
        return at === n
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'adjacent-pairs',
      label: 'Every neighbouring pair has to be witnessed',
      kind: 'optimal',
      time: 'O(total length)',
      space: 'O(n)',
      blurb:
        'The graph is unnecessary, because `nums` already tells you the only order that could work. It is the unique answer exactly when two things hold: no pair in any sequence contradicts the order in `nums`, and every one of the `n - 1` neighbouring pairs of `nums` appears back to back somewhere — otherwise those two values could be swapped freely. One pass over the sequences with a position table.',
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
