import type { Problem } from '@/lib/types'

export const wordPatternII: Problem = {
  id: 'word-pattern-ii',
  title: 'Word Pattern II',
  group: 'Medium',
  pattern: 'Backtracking',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/word-pattern-ii/',
  statement:
    'Given a `pattern` and a string `s`, return true when some one-to-one mapping from pattern letters to non-empty strings turns `pattern` into `s`. No two letters may map to the same string, and no letter to two different strings.',
  constraints: [
    '1 <= pattern.length, s.length <= 20',
    'pattern and s consist of lowercase English letters',
  ],
  signature: {
    fn: 'wordPatternMatch',
    params: [
      { name: 'pattern', type: 'string' },
      { name: 's', type: 'string' },
    ],
    ret: 'bool',
  },
  tests: [
    { args: ['abab', 'redblueredblue'], expect: true, note: "a -> red, b -> blue" },
    { args: ['aaaa', 'asdasdasdasd'], expect: true },
    { args: ['aabb', 'xyzabcxzyabc'], expect: false },
    { args: ['a', 'a'], expect: true, note: 'one letter, one string' },
    { args: ['ab', 'aa'], expect: false, note: 'the mapping has to be one-to-one' },
    { args: ['abc', 'abc'], expect: true },
    { args: ['aa', 'a'], expect: false, note: 's is too short to split' },
  ],
  demo: ['abab', 'redblueredblue'],
  starter: {
    js: `function wordPatternMatch(pattern, s) {
  // pattern: string, s: string  ->  boolean
}
`,
    cpp: `bool wordPatternMatch(string pattern, string s) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'backtrack',
      label: 'Guess one prefix per new letter',
      kind: 'optimal',
      time: 'O(n^m)',
      space: 'O(n)',
      blurb:
        'Walk the pattern left to right. A letter already bound has no choice — the next slice of `s` must equal what it maps to. A fresh letter tries every prefix of what is left, skipping any string already taken by another letter, and undoes the binding when the rest of the pattern fails.',
      code: {
        cpp: {
          lines: [
            'bool wordPatternMatch(string pattern, string s) {',
            '    unordered_map<char, string> toStr;',
            '    unordered_set<string> used;',
            '',
            '    function<bool(int, int)> walk = [&](int pi, int si) {',
            '        if (pi == (int)pattern.size()) return si == (int)s.size();',
            '        char ch = pattern[pi];',
            '',
            '        if (toStr.count(ch)) {',
            '            string w = toStr[ch];',
            '            if (s.compare(si, w.size(), w) != 0) return false;',
            '            return walk(pi + 1, si + (int)w.size());',
            '        }',
            '',
            '        for (int end = si + 1; end <= (int)s.size(); ++end) {',
            '            string w = s.substr(si, end - si);',
            '            if (used.count(w)) continue;',
            '            toStr[ch] = w;',
            '            used.insert(w);',
            '            if (walk(pi + 1, end)) return true;',
            '            toStr.erase(ch);',
            '            used.erase(w);',
            '        }',
            '        return false;',
            '    };',
            '',
            '    return walk(0, 0);',
            '}',
          ],
        },
        js: {
          lines: [
            'function wordPatternMatch(pattern, s) {',
            '  const toStr = new Map();',
            '  const used = new Set();',
            '',
            '  const walk = (pi, si) => {',
            '    if (pi === pattern.length) return si === s.length;',
            '    const ch = pattern[pi];',
            '',
            '    if (toStr.has(ch)) {',
            '      const w = toStr.get(ch);',
            '      if (!s.startsWith(w, si)) return false;',
            '      return walk(pi + 1, si + w.length);',
            '    }',
            '',
            '    for (let end = si + 1; end <= s.length; end++) {',
            '      const w = s.slice(si, end);',
            '      if (used.has(w)) continue;',
            '      toStr.set(ch, w);',
            '      used.add(w);',
            '      if (walk(pi + 1, end)) return true;',
            '      toStr.delete(ch);',
            '      used.delete(w);',
            '    }',
            '    return false;',
            '  };',
            '',
            '  return walk(0, 0);',
            '}',
          ],
        },
      },

      run([pattern, s]: [string, string], c) {
        const toStr = new Map<string, string>()
        const used = new Set<string>()
        const walk = (pi: number, si: number): boolean => {
          c.ops++
          if (pi === pattern.length) return si === s.length
          const ch = pattern[pi]
          if (toStr.has(ch)) {
            const w = toStr.get(ch)!
            if (!s.startsWith(w, si)) return false
            return walk(pi + 1, si + w.length)
          }
          for (let end = si + 1; end <= s.length; end++) {
            const w = s.slice(si, end)
            if (used.has(w)) continue
            toStr.set(ch, w)
            used.add(w)
            if (walk(pi + 1, end)) return true
            toStr.delete(ch)
            used.delete(w)
          }
          return false
        }
        return walk(0, 0)
      },
    },
  ],
}
