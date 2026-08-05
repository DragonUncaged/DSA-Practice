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
    { args: ['2-4A0r7-4k', 4], expect: '24A0-R74K', note: 'the groups divide evenly' },
    { args: ['2-4A0r7-4k', 3], expect: '24-A0R-74K' },
    { args: ['---', 3], expect: '', note: 'nothing but dashes' },
    { args: ['a-a-a', 1], expect: 'A-A-A' },
    { args: ['a', 1], expect: 'A', note: 'a single character' },
    { args: ['ab', 5], expect: 'AB', note: 'k is larger than the whole key' },
    { args: ['a-'.repeat(2000), 4], expect: 'AAAA-'.repeat(500).slice(0, -1), note: 'a long key of 500 full groups' },
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
      id: 'clean-then-slice',
      label: 'Strip the dashes, size the first group, slice',
      kind: 'brute',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'Remove every dash and upper-case what is left, so the key is one clean string. Its length modulo k is the size of the first group (or k when that is zero); emit that prefix, then slice the rest into groups of k. Two passes and an intermediate copy, but each step is the statement read literally.',
      code: {
        cpp: {
          lines: [
            'string licenseKeyFormatting(string s, int k) {',
            '    string clean;',
            '    for (char ch : s) if (ch != \'-\') clean += toupper((unsigned char)ch);',
            '    if (clean.empty()) return "";',
            '    int first = clean.size() % k;',
            '    if (first == 0) first = k;',
            '    string out = clean.substr(0, first);',
            '    for (size_t i = first; i < clean.size(); i += k)',
            '        out += "-" + clean.substr(i, k);',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function licenseKeyFormatting(s, k) {',
            '  const clean = s.replace(/-/g, "").toUpperCase();',
            '  if (!clean) return "";',
            '  const first = clean.length % k || k;',
            '  const groups = [clean.slice(0, first)];',
            '  for (let i = first; i < clean.length; i += k) groups.push(clean.slice(i, i + k));',
            '  return groups.join("-");',
            '}',
          ],
        },
      },
      run([s, k]: [string, number], c) {
        c.ops += s.length
        const clean = s.replace(/-/g, '').toUpperCase()
        if (!clean) return ''
        const first = clean.length % k || k
        const groups = [clean.slice(0, first)]
        for (let i = first; i < clean.length; i += k) {
          c.ops += k
          groups.push(clean.slice(i, i + k))
        }
        return groups.join('-')
      },
    },
    {
      id: 'build-backwards',
      label: 'Build it backwards, then flip',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'The cleaned copy and the modulo arithmetic both go away by changing direction. Groups are anchored to the end, not the start, so walking from the right makes every group regular: emit a dash every k characters, skip dashes, upper-case as you go, then reverse once. The leftover at the far end simply becomes the short leading group.',
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
