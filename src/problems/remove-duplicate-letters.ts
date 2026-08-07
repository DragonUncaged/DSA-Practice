import type { Problem } from '@/lib/types'

export const removeDuplicateLetters: Problem = {
  id: 'remove-duplicate-letters',
  title: 'Remove Duplicate Letters',
  group: 'String',
  pattern: 'Monotonic Stack',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/remove-duplicate-letters/',
  statement:
    'Remove duplicate letters from `s` so that every distinct letter appears exactly once, and among all the results possible, return the one that is smallest in lexicographical order.',
  constraints: [
    '1 <= s.length <= 10^4',
    'Lowercase English letters',
    'Every distinct letter of s must appear exactly once in the answer',
  ],
  signature: {
    fn: 'removeDuplicateLetters',
    params: [{ name: 's', type: 'string' }],
    ret: 'string',
  },
  tests: [
    { args: ['bcabc'], expect: 'abc' },
    { args: ['cbacdcbc'], expect: 'acdb' },
    { args: ['a'], expect: 'a' },
    { args: ['abacb'], expect: 'abc' },
    { args: ['bbcaac'], expect: 'bac', note: 'a letter is kept when it will not reappear' },
    { args: ['abcd'], expect: 'abcd', note: 'already distinct and sorted' },
    { args: ['dcba'], expect: 'dcba', note: 'distinct but reversed: nothing can move' },
    { args: ['aaaa'], expect: 'a', note: 'one letter repeated' },
    { args: ['zyxzyx'], expect: 'xzy' },
    { args: ['leetcode'], expect: 'letcod' },
    { args: ['thesqtitxyetpxloeevdeqifkz'], expect: 'hesitxyplovdqfkz' },
    {
      args: ['zyxwvutsrqponmlkjihgfedcba'.repeat(100)],
      expect: 'abcdefghijklmnopqrstuvwxyz',
      note: 'a long input where every letter keeps reappearing',
    },
  ],
  demo: ['bcabc'],
  scale: (n) => [Array.from({ length: n }, (_, i) => String.fromCharCode(97 + (i % 26))).join('')],
  starter: {
    js: `function removeDuplicateLetters(s) {
  // s: string  ->  string
}
`,
    cpp: `string removeDuplicateLetters(string s) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'greedy-recursion',
      label: 'Pick the first letter, recurse on the rest',
      kind: 'better',
      time: 'O(26 * n)',
      space: 'O(n)',
      blurb:
        'Trying every subsequence is exponential, so the first rung is already a greedy one. The answer\'s first letter should be as small as possible, but only if every other distinct letter still appears after it — so scan s, tracking the smallest letter seen, and stop at the first position where some letter runs out. Emit that letter, delete every copy of it from the remainder, and repeat. Each round costs a full pass, and there are at most 26 rounds.',
      code: {
        cpp: {
          lines: [
            'string removeDuplicateLetters(string s) {',
            '    if (s.empty()) return "";',
            '    int count[26] = {0};',
            '    for (char ch : s) count[ch - \'a\']++;',
            '    int pos = 0;',
            '    for (int i = 0; i < (int)s.size(); ++i) {',
            '        if (s[i] < s[pos]) pos = i;',
            '        if (--count[s[i] - \'a\'] == 0) break;',
            '    }',
            '    string rest;',
            '    for (int i = pos + 1; i < (int)s.size(); ++i)',
            '        if (s[i] != s[pos]) rest += s[i];',
            '    return s[pos] + removeDuplicateLetters(rest);',
            '}',
          ],
        },
        js: {
          lines: [
            'function removeDuplicateLetters(s) {',
            '  if (!s) return "";',
            '  const count = new Map();',
            '  for (const ch of s) count.set(ch, (count.get(ch) ?? 0) + 1);',
            '  let pos = 0;',
            '  for (let i = 0; i < s.length; i++) {',
            '    if (s[i] < s[pos]) pos = i;',
            '    count.set(s[i], count.get(s[i]) - 1);',
            '    if (count.get(s[i]) === 0) break;',
            '  }',
            '  const rest = s.slice(pos + 1).split(s[pos]).join("");',
            '  return s[pos] + removeDuplicateLetters(rest);',
            '}',
          ],
        },
      },
      run([s]: [string], c) {
        const solve = (str: string): string => {
          if (!str) return ''
          const count = new Map<string, number>()
          for (const ch of str) {
            c.ops++
            count.set(ch, (count.get(ch) ?? 0) + 1)
          }
          let pos = 0
          for (let i = 0; i < str.length; i++) {
            c.ops++
            if (str[i] < str[pos]) pos = i
            const left = (count.get(str[i]) ?? 0) - 1
            count.set(str[i], left)
            if (left === 0) break
          }
          const rest = str.slice(pos + 1).split(str[pos]).join('')
          return str[pos] + solve(rest)
        }
        return solve(s)
      },
    },
    {
      id: 'monotonic-stack',
      label: 'Drop a letter only if it comes back',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'The rounds collapse into one pass with a stack. Build the answer left to right: a new letter that is smaller than the top wants to move ahead of it — and that is safe only if the top letter appears again later, which is what the last-occurrence table records. Letters already on the stack are skipped, so each one is pushed once and popped at most once.',
      code: {
        cpp: {
          lines: [
            'string removeDuplicateLetters(string s) {',
            '    vector<int> last(26, -1);',
            '    for (int i = 0; i < (int)s.size(); ++i) last[s[i] - \'a\'] = i;',
            '    vector<bool> onStack(26, false);',
            '    string out;',
            '    for (int i = 0; i < (int)s.size(); ++i) {',
            '        int ch = s[i] - \'a\';',
            '        if (onStack[ch]) continue;',
            '        while (!out.empty() && out.back() > s[i] && last[out.back() - \'a\'] > i) {',
            '            onStack[out.back() - \'a\'] = false;',
            '            out.pop_back();',
            '        }',
            '        out += s[i];',
            '        onStack[ch] = true;',
            '    }',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function removeDuplicateLetters(s) {',
            '  const last = new Map();',
            '  for (let i = 0; i < s.length; i++) last.set(s[i], i);',
            '  const onStack = new Set();',
            '  const out = [];',
            '  for (let i = 0; i < s.length; i++) {',
            '    const ch = s[i];',
            '    if (onStack.has(ch)) continue;',
            '    while (out.length && out[out.length - 1] > ch && last.get(out[out.length - 1]) > i) {',
            '      onStack.delete(out.pop());',
            '    }',
            '    out.push(ch);',
            '    onStack.add(ch);',
            '  }',
            '  return out.join("");',
            '}',
          ],
        },
      },

      run([s]: [string], c) {
        const last = new Map<string, number>()
        for (let i = 0; i < s.length; i++) last.set(s[i], i)
        const onStack = new Set<string>()
        const out: string[] = []
        for (let i = 0; i < s.length; i++) {
          c.ops++
          const ch = s[i]
          if (onStack.has(ch)) continue
          while (out.length && out[out.length - 1] > ch && last.get(out[out.length - 1])! > i) {
            c.ops++
            onStack.delete(out.pop()!)
          }
          out.push(ch)
          onStack.add(ch)
        }
        return out.join('')
      },
    },
  ],
}
