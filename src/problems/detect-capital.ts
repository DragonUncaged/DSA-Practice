import type { Problem } from '@/lib/types'

export const detectCapital: Problem = {
  id: 'detect-capital',
  title: 'Detect Capital',
  group: 'String',
  pattern: 'Frequency Count',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/detect-capital/',
  statement:
    'Capitalisation in a `word` is correct when all its letters are capitals, none of them are, or only the first one is. Return `true` if `word` uses capitals correctly.',
  constraints: ['1 <= word.length <= 100', 'Upper and lower case English letters only'],
  signature: { fn: 'detectCapitalUse', params: [{ name: 'word', type: 'string' }], ret: 'bool' },
  tests: [
    { args: ['USA'], expect: true },
    { args: ['FlaG'], expect: false },
    { args: ['leetcode'], expect: true },
    { args: ['Google'], expect: true },
    { args: ['g'], expect: true, note: 'a single letter is always correct' },
  ],
  demo: ['USA'],
  scale: (n) => ['a'.repeat(n)],
  starter: {
    js: `function detectCapitalUse(word) {
  // word: string  ->  boolean
}
`,
    cpp: `bool detectCapitalUse(string word) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'count-capitals',
      label: 'Count the capitals, then check two shapes',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'The three legal shapes reduce to a single count. Every letter capital means the count equals the length; no capital past the first means the count is zero or one with the capital at the front. Nothing else passes.',
      code: {
        cpp: {
          lines: [
            'bool detectCapitalUse(string word) {',
            '    int caps = 0;',
            '    for (char ch : word) if (isupper((unsigned char)ch)) caps++;',
            '    if (caps == (int)word.size()) return true;',
            '    return caps == 0 || (caps == 1 && isupper((unsigned char)word[0]));',
            '}',
          ],
        },
        js: {
          lines: [
            'function detectCapitalUse(word) {',
            '  const isUpper = (ch) => ch >= "A" && ch <= "Z";',
            '  let caps = 0;',
            '  for (const ch of word) if (isUpper(ch)) caps++;',
            '  if (caps === word.length) return true;',
            '  return caps === 0 || (caps === 1 && isUpper(word[0]));',
            '}',
          ],
        },
      },

      run([word]: [string], c) {
        const isUpper = (ch: string) => ch >= 'A' && ch <= 'Z'
        let caps = 0
        for (const ch of word) {
          c.ops++
          if (isUpper(ch)) caps++
        }
        if (caps === word.length) return true
        return caps === 0 || (caps === 1 && isUpper(word[0]))
      },
    },
  ],
}
