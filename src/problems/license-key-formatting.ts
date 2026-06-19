import type { Problem } from '@/lib/types'

export const licenseKeyFormatting: Problem = {
  id: 'license-key-formatting',
  title: 'License Key Formatting',
  group: 'String',
  pattern: 'Right-to-left Grouping',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/license-key-formatting/',
  statement:
    'A license key `s` holds alphanumeric characters separated by dashes. Reformat it so that every group holds exactly `k` characters except the first, which may be shorter but must not be empty, joining the groups with dashes and upper-casing every letter.',
  constraints: [
    '1 <= s.length <= 10^5',
    's contains alphanumerics and dashes only',
    '1 <= k <= 10^4',
  ],
  signature: {
    fn: 'licenseKeyFormatting',
    params: [
      { name: 's', type: 'string' },
      { name: 'k', type: 'int' },
    ],
    ret: 'string',
  },
  tests: [
    { args: ['5F3Z-2e-9-w', 4], expect: '5F3Z-2E9W' },
    { args: ['2-5g-3-J', 2], expect: '2-5G-3J', note: 'the first group is the short one' },
    { args: ['---', 3], expect: '', note: 'nothing but dashes' },
    { args: ['a-a-a', 1], expect: 'A-A-A' },
  ],
  demo: ['5F3Z-2e-9-w', 4],
  scale: (n) => ['ab-'.repeat(Math.max(1, Math.floor(n / 3))), 4],
  starter: {
    js: `function licenseKeyFormatting(s, k) {
  // s: string, k: number  ->  string
}
`,
    cpp: `string licenseKeyFormatting(string s, int k) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'build-backwards',
      label: 'Build it backwards, then flip',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'Groups are anchored to the end, not the start, so the only irregular group is the first — and its size is not known until the dashes have been counted. Walking from the right sidesteps that: emit a dash every k characters, then reverse. The leftover simply becomes the short leading group.',
      code: {
        cpp: {
          lines: [
            'string licenseKeyFormatting(string s, int k) {',
            '    string out;',
            '    int run = 0;',
            '    for (int i = (int)s.size() - 1; i >= 0; --i) {',
            '        if (s[i] == \'-\') continue;',
            '        if (run == k) { out += \'-\'; run = 0; }',
            '        out += toupper((unsigned char)s[i]);',
            '        run++;',
            '    }',
            '    reverse(out.begin(), out.end());',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function licenseKeyFormatting(s, k) {',
            '  const out = [];',
            '  let run = 0;',
            '  for (let i = s.length - 1; i >= 0; i--) {',
            '    if (s[i] === "-") continue;',
            '    if (run === k) { out.push("-"); run = 0; }',
            '    out.push(s[i].toUpperCase());',
            '    run++;',
            '  }',
            '  return out.reverse().join("");',
            '}',
          ],
        },
      },

      run([s, k]: [string, number], c) {
        const out: string[] = []
        let run = 0
        for (let i = s.length - 1; i >= 0; i--) {
          c.ops++
          if (s[i] === '-') continue
          if (run === k) {
            out.push('-')
            run = 0
          }
          out.push(s[i].toUpperCase())
          run++
        }
        return out.reverse().join('')
      },
    },
  ],
}
