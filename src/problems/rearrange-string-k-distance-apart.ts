import type { Problem } from '@/lib/types'

export const rearrangeStringKDistanceApart: Problem = {
  id: 'rearrange-string-k-distance-apart',
  title: 'Rearrange String k Distance Apart',
  group: 'Hard',
  pattern: 'Greedy',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/rearrange-string-k-distance-apart/',
  statement:
    'Rearrange `s` so that equal characters sit at least `k` apart, or return `""` when that is impossible. Several arrangements can be valid; return the one you get by filling the string in blocks of `k`, each time taking the character with the most copies left and breaking ties alphabetically.',
  constraints: [
    '1 <= s.length <= 3 * 10^5',
    's consists of lowercase English letters',
    '0 <= k <= s.length',
  ],
  signature: {
    fn: 'rearrangeString',
    params: [
      { name: 's', type: 'string' },
      { name: 'k', type: 'int' },
    ],
    ret: 'string',
  },
  tests: [
    { args: ['aabbcc', 3], expect: 'abcabc' },
    { args: ['aaabc', 3], expect: '', note: 'too many a to spread out' },
    { args: ['aaadbbcc', 2], expect: 'abacabcd' },
    { args: ['a', 1], expect: 'a', note: 'single character' },
    { args: ['aa', 2], expect: '', note: 'no room for the second a' },
    { args: ['aabb', 0], expect: 'abab', note: 'k = 0 puts no constraint on the order' },
  ],
  demo: ['aabbcc', 3],
  starter: {
    js: `function rearrangeString(s, k) {
  // s: string, k: number  ->  string
}
`,
    cpp: `string rearrangeString(string s, int k) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'greedy-blocks',
      label: 'Fill blocks of k with the most frequent left',
      kind: 'optimal',
      time: 'O(n log 26)',
      space: 'O(26)',
      blurb:
        'Inside any window of `k` consecutive positions every character is distinct, so build the answer one such block at a time. Spending the most frequent characters first is what stops one letter from piling up at the end; if a block cannot be filled with distinct characters, no arrangement exists.',
      code: {
        cpp: {
          lines: [
            'string rearrangeString(string s, int k) {',
            '    vector<int> count(26, 0);',
            '    for (char ch : s) count[ch - 97]++;',
            '',
            '    string out;',
            '    vector<bool> usedHere(26, false);',
            '    int left = s.size();',
            '    int step = max(k, 1);',
            '',
            '    while (left > 0) {',
            '        int take = min(step, left);',
            '        vector<int> spent;',
            '        for (int t = 0; t < take; ++t) {',
            '            int best = -1;',
            '            for (int ch = 0; ch < 26; ++ch) {',
            '                if (count[ch] == 0 || usedHere[ch]) continue;',
            '                if (best < 0 || count[ch] > count[best]) best = ch;',
            '            }',
            '            if (best < 0) return "";',
            '            out += char(97 + best);',
            '            count[best]--;',
            '            usedHere[best] = true;',
            '            spent.push_back(best);',
            '            left--;',
            '        }',
            '        for (int ch : spent) usedHere[ch] = false;  // the block is over',
            '    }',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function rearrangeString(s, k) {',
            '  const count = new Array(26).fill(0);',
            '  for (const ch of s) count[ch.charCodeAt(0) - 97]++;',
            '',
            '  const out = [];',
            '  const usedHere = new Array(26).fill(false);',
            '  let left = s.length;',
            '  const step = Math.max(k, 1);',
            '',
            '  while (left > 0) {',
            '    const take = Math.min(step, left);',
            '    const spent = [];',
            '    for (let t = 0; t < take; t++) {',
            '      let best = -1;',
            '      for (let ch = 0; ch < 26; ch++) {',
            '        if (count[ch] === 0 || usedHere[ch]) continue;',
            '        if (best < 0 || count[ch] > count[best]) best = ch;',
            '      }',
            "      if (best < 0) return '';",
            '      out.push(String.fromCharCode(97 + best));',
            '      count[best]--;',
            '      usedHere[best] = true;',
            '      spent.push(best);',
            '      left--;',
            '    }',
            '    for (const ch of spent) usedHere[ch] = false; // the block is over',
            '  }',
            "  return out.join('');",
            '}',
          ],
        },
      },

      run([s, k]: [string, number], c) {
        const count = new Array<number>(26).fill(0)
        for (const ch of s) count[ch.charCodeAt(0) - 97]++
        const out: string[] = []
        const usedHere = new Array<boolean>(26).fill(false)
        let left = s.length
        const step = Math.max(k, 1)
        while (left > 0) {
          const take = Math.min(step, left)
          const spent: number[] = []
          for (let t = 0; t < take; t++) {
            c.ops++
            let best = -1
            for (let ch = 0; ch < 26; ch++) {
              if (count[ch] === 0 || usedHere[ch]) continue
              if (best < 0 || count[ch] > count[best]) best = ch
            }
            if (best < 0) return ''
            out.push(String.fromCharCode(97 + best))
            count[best]--
            usedHere[best] = true
            spent.push(best)
            left--
          }
          for (const ch of spent) usedHere[ch] = false
        }
        return out.join('')
      },
    },
  ],
}
