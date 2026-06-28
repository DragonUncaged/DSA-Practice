import type { Problem } from '@/lib/types'

export const groupShiftedStrings: Problem = {
  id: 'group-shifted-strings',
  title: 'Group Shifted Strings',
  group: 'Medium',
  pattern: 'Hash Map',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/group-shifted-strings/',
  statement:
    'Shifting a string moves every letter one step along the alphabet, wrapping `z` back to `a`, so `"abc"` shifts to `"bcd"` and eventually to `"xyz"`. Given an array `strings`, group together the strings that belong to the same shifting sequence. The groups, and the strings inside them, may come back in any order.',
  constraints: [
    '1 <= strings.length <= 200',
    '1 <= strings[i].length <= 50',
    'strings[i] consists of lowercase English letters',
  ],
  signature: {
    fn: 'groupStrings',
    params: [{ name: 'strings', type: 'string[]' }],
    ret: 'string[][]',
  },
  compare: 'sorted',
  tests: [
    {
      args: [['abc', 'bcd', 'acef', 'xyz', 'az', 'ba', 'a', 'z']],
      expect: [['acef'], ['a', 'z'], ['abc', 'bcd', 'xyz'], ['az', 'ba']],
    },
    { args: [['a']], expect: [['a']], note: 'single string' },
    { args: [['az', 'ba', 'by']], expect: [['az', 'ba'], ['by']], note: 'wrap-around gap of 25' },
    {
      args: [['abc', 'abc']],
      expect: [['abc', 'abc']],
      note: 'duplicates stay in the same group',
    },
  ],
  demo: [['abc', 'bcd', 'acef', 'xyz', 'az', 'ba', 'a', 'z']],
  starter: {
    js: `function groupStrings(strings) {
  // strings: string[]  ->  string[][]
}
`,
    cpp: `vector<vector<string>> groupStrings(vector<string>& strings) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'gap-key',
      label: 'Key on the gaps between letters',
      kind: 'optimal',
      time: 'O(n * L)',
      space: 'O(n * L)',
      blurb:
        'Shifting moves every letter by the same amount, so it leaves the gaps between neighbouring letters untouched. Turn each string into its list of gaps modulo 26 and use that as a hash-map key — one bucket per shifting sequence.',
      code: {
        cpp: {
          lines: [
            'vector<vector<string>> groupStrings(vector<string>& strings) {',
            '    unordered_map<string, vector<string>> buckets;',
            '    for (const string& s : strings) {',
            '        string key;',
            '        for (size_t i = 1; i < s.size(); ++i) {',
            '            int gap = (s[i] - s[i - 1] + 26) % 26;',
            "            key += to_string(gap) + ',';",
            '        }',
            '        buckets[key].push_back(s);',
            '    }',
            '',
            '    vector<vector<string>> out;',
            '    for (auto& b : buckets) out.push_back(b.second);',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function groupStrings(strings) {',
            '  const buckets = new Map();',
            '  for (const s of strings) {',
            '    const gaps = [];',
            '    for (let i = 1; i < s.length; i++) {',
            '      gaps.push((s.charCodeAt(i) - s.charCodeAt(i - 1) + 26) % 26);',
            '    }',
            "    const key = gaps.join(',');",
            '    if (!buckets.has(key)) buckets.set(key, []);',
            '    buckets.get(key).push(s);',
            '  }',
            '  return [...buckets.values()];',
            '}',
          ],
        },
      },

      run([strings]: [string[]], c) {
        const buckets = new Map<string, string[]>()
        for (const s of strings) {
          const gaps: number[] = []
          for (let i = 1; i < s.length; i++) {
            c.ops++
            gaps.push((s.charCodeAt(i) - s.charCodeAt(i - 1) + 26) % 26)
          }
          const key = gaps.join(',')
          if (!buckets.has(key)) buckets.set(key, [])
          buckets.get(key)!.push(s)
        }
        return [...buckets.values()]
      },
    },
  ],
}
