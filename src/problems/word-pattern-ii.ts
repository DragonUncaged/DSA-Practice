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
    { args: ['abba', 'dogcatcatdog'], expect: true, note: 'a -> dog, b -> cat' },
    { args: ['abba', 'dogcatcatfish'], expect: false },
    { args: ['abcdefghijklmnopqrst', 'abcdefghijklmnopqrst'], expect: true, note: 'twenty letters, one each' },
    { args: ['a', 'abcdefghijklmnopqrst'], expect: true, note: 'one letter swallows the whole string' },
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
      id: 'every-split',
      label: 'Try every way to cut s into pieces, then check the mapping',
      kind: 'brute',
      time: 'O(C(n - 1, m - 1) * n)',
      space: 'O(m)',
      blurb:
        'Cut `s` into exactly `pattern.length` non-empty pieces in every possible way, and only then check whether the pieces line up with the pattern one-to-one. Correct, but the check comes last, so a split that is wrong at its first piece is still completed and inspected in full.',
      code: {
        cpp: {
          lines: [
            'bool wordPatternMatch(string pattern, string s) {',
            '    int m = pattern.size(), n = s.size();',
            '    if (m > n) return false;',
            '    vector<int> cuts(m, 0);  // cuts[i] is where piece i starts',
            '    auto consistent = [&]() {',
            '        unordered_map<char, string> toStr;',
            '        unordered_set<string> used;',
            '        for (int i = 0; i < m; ++i) {',
            '            int end = i + 1 < m ? cuts[i + 1] : n;',
            '            string w = s.substr(cuts[i], end - cuts[i]);',
            '            auto it = toStr.find(pattern[i]);',
            '            if (it != toStr.end()) { if (it->second != w) return false; }',
            '            else { if (used.count(w)) return false; toStr[pattern[i]] = w; used.insert(w); }',
            '        }',
            '        return true;',
            '    };',
            '    function<bool(int, int)> choose = [&](int i, int start) {',
            '        if (i == m) return consistent();',
            '        for (int st = start; st <= n - (m - i); ++st) {',
            '            cuts[i] = st;',
            '            if (choose(i + 1, st + 1)) return true;',
            '        }',
            '        return false;',
            '    };',
            '    return choose(1, 1);',
            '}',
          ],
        },
        js: {
          lines: [
            'function wordPatternMatch(pattern, s) {',
            '  const m = pattern.length;',
            '  const n = s.length;',
            '  if (m > n) return false;',
            '  const cuts = new Array(m).fill(0); // cuts[i] is where piece i starts',
            '',
            '  const consistent = () => {',
            '    const toStr = new Map();',
            '    const used = new Set();',
            '    for (let i = 0; i < m; i++) {',
            '      const w = s.slice(cuts[i], i + 1 < m ? cuts[i + 1] : n);',
            '      if (toStr.has(pattern[i])) {',
            '        if (toStr.get(pattern[i]) !== w) return false;',
            '      } else {',
            '        if (used.has(w)) return false;',
            '        toStr.set(pattern[i], w);',
            '        used.add(w);',
            '      }',
            '    }',
            '    return true;',
            '  };',
            '',
            '  const choose = (i, start) => {',
            '    if (i === m) return consistent();',
            '    for (let st = start; st <= n - (m - i); st++) {',
            '      cuts[i] = st;',
            '      if (choose(i + 1, st + 1)) return true;',
            '    }',
            '    return false;',
            '  };',
            '  return choose(1, 1);',
            '}',
          ],
        },
      },

      run([pattern, s]: [string, string], c) {
        const m = pattern.length
        const n = s.length
        if (m > n) return false
        const cuts = new Array<number>(m).fill(0)
        const consistent = () => {
          const toStr = new Map<string, string>()
          const used = new Set<string>()
          for (let i = 0; i < m; i++) {
            c.ops++
            const w = s.slice(cuts[i], i + 1 < m ? cuts[i + 1] : n)
            if (toStr.has(pattern[i])) {
              if (toStr.get(pattern[i]) !== w) return false
            } else {
              if (used.has(w)) return false
              toStr.set(pattern[i], w)
              used.add(w)
            }
          }
          return true
        }
        const choose = (i: number, start: number): boolean => {
          if (i === m) return consistent()
          for (let st = start; st <= n - (m - i); st++) {
            c.ops++
            cuts[i] = st
            if (choose(i + 1, st + 1)) return true
          }
          return false
        }
        return choose(1, 1)
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'backtrack',
      label: 'Guess one prefix per new letter',
      kind: 'optimal',
      time: 'O(n^m)',
      space: 'O(n)',
      blurb:
        'Check as you cut, so a wrong piece kills the whole branch at once. Walk the pattern left to right: a letter already bound has no choice — the next slice of `s` must equal what it maps to. A fresh letter tries every prefix of what is left, skipping any string already taken by another letter, and undoes the binding when the rest of the pattern fails.',
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
