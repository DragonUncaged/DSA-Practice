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
    {
      args: [['abc', 'abd', 'bcd', 'bce']],
      expect: [['abc', 'bcd'], ['abd', 'bce']],
      note: 'same length, different gap patterns',
    },
    {
      args: [['zab', 'abc', 'yza']],
      expect: [['zab', 'abc', 'yza']],
      note: 'wrapping past z keeps the gaps',
    },
  ],
  scale: (n) => [Array.from({ length: n }, (_, i) => String.fromCharCode(97 + (i % 26)) + 'x'.repeat(i % 5))],
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
      id: 'compare-with-groups',
      label: 'Test each string against a representative of every group',
      kind: 'brute',
      time: 'O(n^2 * L)',
      space: 'O(n * L)',
      blurb:
        'Two strings belong together when one shifts into the other: same length, and every letter moved by the same amount. Check each new string against the first member of every group so far, joining the first match or starting a new group. Correct, but the number of comparisons grows with the square of the input.',
      code: {
        cpp: {
          lines: [
            'static bool isShift(const string& a, const string& b) {',
            '    if (a.size() != b.size()) return false;',
            '    int d = (b[0] - a[0] + 26) % 26;',
            '    for (size_t i = 0; i < a.size(); ++i)',
            "        if ((a[i] - 'a' + d) % 26 + 'a' != b[i]) return false;",
            '    return true;',
            '}',
            '',
            'vector<vector<string>> groupStrings(vector<string>& strings) {',
            '    vector<vector<string>> groups;',
            '    for (const string& s : strings) {',
            '        bool placed = false;',
            '        for (auto& g : groups) {',
            '            if (isShift(g[0], s)) { g.push_back(s); placed = true; break; }',
            '        }',
            '        if (!placed) groups.push_back({s});',
            '    }',
            '    return groups;',
            '}',
          ],
        },
        js: {
          lines: [
            'function groupStrings(strings) {',
            '  const isShift = (a, b) => {',
            '    if (a.length !== b.length) return false;',
            '    const d = (b.charCodeAt(0) - a.charCodeAt(0) + 26) % 26;',
            '    for (let i = 0; i < a.length; i++) {',
            '      if (((a.charCodeAt(i) - 97 + d) % 26) + 97 !== b.charCodeAt(i)) return false;',
            '    }',
            '    return true;',
            '  };',
            '',
            '  const groups = [];',
            '  for (const s of strings) {',
            '    const g = groups.find((grp) => isShift(grp[0], s));',
            '    if (g) g.push(s);',
            '    else groups.push([s]);',
            '  }',
            '  return groups;',
            '}',
          ],
        },
      },

      run([strings]: [string[]], c) {
        const isShift = (a: string, b: string) => {
          if (a.length !== b.length) return false
          const d = (b.charCodeAt(0) - a.charCodeAt(0) + 26) % 26
          for (let i = 0; i < a.length; i++) {
            c.ops++
            if (((a.charCodeAt(i) - 97 + d) % 26) + 97 !== b.charCodeAt(i)) return false
          }
          return true
        }
        const groups: string[][] = []
        for (const s of strings) {
          c.ops++
          const g = groups.find((grp) => isShift(grp[0], s))
          if (g) g.push(s)
          else groups.push([s])
        }
        return groups
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'gap-key',
      label: 'Key on the gaps between letters',
      kind: 'optimal',
      time: 'O(n * L)',
      space: 'O(n * L)',
      blurb:
        'Comparing against every group is what a hash map exists to avoid. Shifting moves every letter by the same amount, so it leaves the gaps between neighbouring letters untouched: turn each string into its list of gaps modulo 26 and use that as the key. One bucket per shifting sequence, one lookup per string.',
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
