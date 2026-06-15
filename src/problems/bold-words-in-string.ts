import type { Problem } from '@/lib/types'

export const boldWordsInString: Problem = {
  id: 'bold-words-in-string',
  title: 'Bold Words in String',
  group: 'String',
  pattern: 'Mark and Merge',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/bold-words-in-string/',
  statement:
    'Given a list of keywords `words` and a string `s`, wrap every substring of `s` that appears in `words` with `<b>` and `</b>`. Overlapping or touching matches must be covered by a single pair of tags, and the result must use as few tags as possible.',
  constraints: [
    '0 <= words.length <= 50',
    '1 <= s.length <= 500',
    'Lowercase English letters',
    'Adjacent or overlapping matches merge into one bold run',
  ],
  signature: {
    fn: 'boldWords',
    params: [
      { name: 'words', type: 'string[]' },
      { name: 's', type: 'string' },
    ],
    ret: 'string',
  },
  tests: [
    { args: [['ab', 'bc'], 'aabcd'], expect: 'a<b>abc</b>d', note: 'two overlapping matches merge' },
    { args: [['a'], 'a'], expect: '<b>a</b>' },
    { args: [['x'], 'abc'], expect: 'abc', note: 'nothing matches' },
    { args: [['aa', 'b'], 'aabb'], expect: '<b>aabb</b>', note: 'touching matches merge' },
    { args: [[], 'abc'], expect: 'abc' },
  ],
  demo: [['ab', 'bc'], 'aabcd'],
  starter: {
    js: `function boldWords(words, s) {
  // words: string[], s: string  ->  string
}
`,
    cpp: `string boldWords(vector<string>& words, string s) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'mask',
      label: 'Paint a boolean mask, then emit',
      kind: 'optimal',
      time: 'O(n * w * L)',
      space: 'O(n)',
      blurb:
        'Deciding where the tags go while matching is what makes this fiddly, because overlaps and neighbours interact. Splitting it into two phases removes the problem: first mark every covered character in a boolean mask, then walk the mask once and open a tag where it turns on, close it where it turns off.',
      code: {
        cpp: {
          lines: [
            'string boldWords(vector<string>& words, string s) {',
            '    int n = s.size();',
            '    vector<bool> bold(n, false);',
            '    for (auto& w : words)',
            '        for (size_t at = s.find(w); at != string::npos; at = s.find(w, at + 1))',
            '            for (size_t k = at; k < at + w.size(); ++k) bold[k] = true;',
            '    string out;',
            '    for (int i = 0; i < n; ++i) {',
            '        if (bold[i] && (i == 0 || !bold[i - 1])) out += "<b>";',
            '        out += s[i];',
            '        if (bold[i] && (i == n - 1 || !bold[i + 1])) out += "</b>";',
            '    }',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function boldWords(words, s) {',
            '  const n = s.length;',
            '  const bold = new Array(n).fill(false);',
            '  for (const w of words)',
            '    for (let at = s.indexOf(w); at !== -1; at = s.indexOf(w, at + 1))',
            '      for (let k = at; k < at + w.length; k++) bold[k] = true;',
            '  let out = "";',
            '  for (let i = 0; i < n; i++) {',
            '    if (bold[i] && (i === 0 || !bold[i - 1])) out += "<b>";',
            '    out += s[i];',
            '    if (bold[i] && (i === n - 1 || !bold[i + 1])) out += "</b>";',
            '  }',
            '  return out;',
            '}',
          ],
        },
      },

      run([words, s]: [string[], string], c) {
        const n = s.length
        const bold = new Array<boolean>(n).fill(false)
        for (const w of words) {
          if (!w) continue
          for (let at = s.indexOf(w); at !== -1; at = s.indexOf(w, at + 1)) {
            c.ops++
            for (let k = at; k < at + w.length; k++) bold[k] = true
          }
        }
        let out = ''
        for (let i = 0; i < n; i++) {
          c.ops++
          if (bold[i] && (i === 0 || !bold[i - 1])) out += '<b>'
          out += s[i]
          if (bold[i] && (i === n - 1 || !bold[i + 1])) out += '</b>'
        }
        return out
      },
    },
  ],
}
