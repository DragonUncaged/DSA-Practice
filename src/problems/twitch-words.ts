import type { Problem } from '@/lib/types'

export const twitchWords: Problem = {
  id: 'twitch-words',
  title: 'Twitch Words',
  group: 'String',
  pattern: 'Run Detection',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/positions-of-large-groups/',
  statement:
    'A *twitch word* is a run of three or more identical consecutive characters in `str`. Return the `[start, end]` index pair of every twitch word, in increasing order of `start`. Both ends are inclusive.',
  constraints: [
    '0 <= str.length <= 10^4',
    'Lowercase English letters',
    'A run counts only when it is at least three characters long',
  ],
  signature: { fn: 'twitchWords', params: [{ name: 'str', type: 'string' }], ret: 'int[][]' },
  tests: [
    { args: ['abbbcedddd'], expect: [[1, 3], [6, 9]] },
    { args: ['aaa'], expect: [[0, 2]], note: 'the run reaches the end of the string' },
    { args: ['abc'], expect: [], note: 'no run is long enough' },
    {
      args: ['aabbbcccc'],
      expect: [
        [2, 4],
        [5, 8],
      ],
      note: 'a run of two does not count',
    },
    { args: [''], expect: [], note: 'the empty string' },
    { args: ['a'], expect: [] },
    { args: ['aaaa'], expect: [[0, 3]], note: 'one run longer than three' },
    { args: ['aabaaa'], expect: [[3, 5]], note: 'the same letter, but only the second run is long enough' },
    {
      args: ['aaabbb'],
      expect: [
        [0, 2],
        [3, 5],
      ],
      note: 'two runs back to back',
    },
    {
      args: ['aaab'.repeat(500)],
      expect: Array.from({ length: 500 }, (_, i) => [4 * i, 4 * i + 2]),
      note: 'a long string of 500 runs',
    },
  ],
  demo: ['abbbcedddd'],
  scale: (n) => ['aaab'.repeat(Math.max(1, n >> 2))],
  starter: {
    js: `function twitchWords(str) {
  // str: string  ->  number[][]
}
`,
    cpp: `vector<vector<int>> twitchWords(string str) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'run-boundaries',
      label: 'Walk each run to its end',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Runs never overlap, so a single pointer can jump from the start of one run straight to the start of the next. Advance a second index while the character repeats; the gap between the two is the run length, and only runs of three or more are recorded. This is the only rung: every character has to be read once, and any other scan that finds the run boundaries is this one with different bookkeeping.',
      code: {
        cpp: {
          lines: [
            'vector<vector<int>> twitchWords(string str) {',
            '    vector<vector<int>> out;',
            '    int n = str.size(), i = 0;',
            '    while (i < n) {',
            '        int j = i;',
            '        while (j < n && str[j] == str[i]) j++;',
            '        if (j - i >= 3) out.push_back({i, j - 1});',
            '        i = j;',
            '    }',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function twitchWords(str) {',
            '  const out = [];',
            '  let i = 0;',
            '  while (i < str.length) {',
            '    let j = i;',
            '    while (j < str.length && str[j] === str[i]) j++;',
            '    if (j - i >= 3) out.push([i, j - 1]);',
            '    i = j;',
            '  }',
            '  return out;',
            '}',
          ],
        },
      },

      run([str]: [string], c) {
        const out: number[][] = []
        let i = 0
        while (i < str.length) {
          let j = i
          while (j < str.length && str[j] === str[i]) {
            c.ops++
            j++
          }
          if (j - i >= 3) out.push([i, j - 1])
          i = j
        }
        return out
      },
    },
  ],
}
