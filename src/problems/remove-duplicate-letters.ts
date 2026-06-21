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
      id: 'monotonic-stack',
      label: 'Drop a letter only if it comes back',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'Build the answer left to right on a stack. A new letter that is smaller than the top wants to move ahead of it — and that is safe only if the top letter appears again later, which is what the last-occurrence table records. Letters already on the stack are skipped, so each one is pushed once and popped at most once.',
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
