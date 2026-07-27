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
    { args: [['abcd'], 'abc'], expect: 'abc', note: 'a keyword longer than the text' },
    { args: [['a', 'b'], 'abcab'], expect: '<b>ab</b>c<b>ab</b>', note: 'two separate runs' },
    { args: [['ab'], 'ababab'], expect: '<b>ababab</b>', note: 'repeated matches chain into one run' },
    { args: [['abc', 'b'], 'xbx'], expect: 'x<b>b</b>x', note: 'a keyword that is a prefix of another' },
    { args: [['a'], 'aaaaa'], expect: '<b>aaaaa</b>' },
    {
      args: [['ab', 'cd'], 'abxcdx'.repeat(83)],
      expect: '<b>ab</b>x<b>cd</b>x'.repeat(83),
      note: 'a long text with 166 separate runs',
    },
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
      label: 'Try every word at every index, paint a mask',
      kind: 'brute',
      time: 'O(n * w * L)',
      space: 'O(n)',
      blurb:
        'Deciding where the tags go while matching is what makes this fiddly, because overlaps and neighbours interact. Splitting it into two phases removes the problem: at every index test every keyword and mark the characters it covers in a boolean mask, then walk the mask once and open a tag where it turns on, close it where it turns off. The matching phase compares every keyword against every position, so its cost is the text length times the total keyword length.',
      code: {
        cpp: {
          lines: [
            'string boldWords(vector<string>& words, string s) {',
            '    int n = s.size();',
            '    vector<bool> bold(n, false);',
            '    for (int i = 0; i < n; ++i)',
            '        for (auto& w : words)',
            '            if (s.compare(i, w.size(), w) == 0)',
            '                for (size_t k = i; k < i + w.size(); ++k) bold[k] = true;',
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
            '  for (let i = 0; i < n; i++)',
            '    for (const w of words)',
            '      if (w.length && s.startsWith(w, i))',
            '        for (let k = i; k < i + w.length; k++) bold[k] = true;',
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
        for (let i = 0; i < n; i++)
          for (const w of words) {
            c.ops++
            if (w.length && s.startsWith(w, i))
              for (let k = i; k < i + w.length; k++) bold[k] = true
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
    {
      id: 'trie-reach',
      label: 'Walk a trie, track the furthest bold reach',
      kind: 'optimal',
      time: 'O(n * L + total keyword length)',
      space: 'O(total keyword length)',
      blurb:
        'Testing each keyword separately repeats work on shared prefixes. Put the keywords in a trie: from each index, one walk down the trie finds every keyword starting there in at most L steps, and only the longest match matters, since it covers the others. Carry the furthest index any match reaches; a character is bold while it lies before that reach, which yields the runs directly without a mask.',
      code: {
        cpp: {
          lines: [
            'string boldWords(vector<string>& words, string s) {',
            '    vector<array<int, 26>> next(1);',
            '    vector<bool> isWord(1, false);',
            '    next[0].fill(-1);',
            '    for (auto& w : words) {',
            '        int node = 0;',
            '        for (char ch : w) {',
            '            int k = ch - \'a\';',
            '            if (next[node][k] == -1) {',
            '                next[node][k] = next.size();',
            '                next.emplace_back(); next.back().fill(-1);',
            '                isWord.push_back(false);',
            '            }',
            '            node = next[node][k];',
            '        }',
            '        isWord[node] = true;',
            '    }',
            '    int n = s.size(), reach = 0;',
            '    string out;',
            '    bool open = false;',
            '    for (int i = 0; i < n; ++i) {',
            '        int node = 0;',
            '        for (int j = i; j < n; ++j) {',
            '            node = next[node][s[j] - \'a\'];',
            '            if (node == -1) break;',
            '            if (isWord[node]) reach = max(reach, j + 1);',
            '        }',
            '        bool bold = i < reach;',
            '        if (bold && !open) { out += "<b>"; open = true; }',
            '        if (!bold && open) { out += "</b>"; open = false; }',
            '        out += s[i];',
            '    }',
            '    if (open) out += "</b>";',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function boldWords(words, s) {',
            '  const root = {};',
            '  for (const w of words) {',
            '    let node = root;',
            '    for (const ch of w) node = node[ch] ?? (node[ch] = {});',
            '    node.end = true;',
            '  }',
            '  let out = "", reach = 0, open = false;',
            '  for (let i = 0; i < s.length; i++) {',
            '    let node = root;',
            '    for (let j = i; j < s.length; j++) {',
            '      node = node[s[j]];',
            '      if (!node) break;',
            '      if (node.end) reach = Math.max(reach, j + 1);',
            '    }',
            '    const bold = i < reach;',
            '    if (bold && !open) { out += "<b>"; open = true; }',
            '    if (!bold && open) { out += "</b>"; open = false; }',
            '    out += s[i];',
            '  }',
            '  if (open) out += "</b>";',
            '  return out;',
            '}',
          ],
        },
      },
      run([words, s]: [string[], string], c) {
        type Node = { end?: boolean; kids: Map<string, Node> }
        const root: Node = { kids: new Map() }
        for (const w of words) {
          let node = root
          for (const ch of w) {
            c.ops++
            let kid = node.kids.get(ch)
            if (!kid) {
              kid = { kids: new Map() }
              node.kids.set(ch, kid)
            }
            node = kid
          }
          node.end = true
        }
        let out = ''
        let reach = 0
        let open = false
        for (let i = 0; i < s.length; i++) {
          let node: Node | undefined = root
          for (let j = i; j < s.length; j++) {
            c.ops++
            node = node.kids.get(s[j])
            if (!node) break
            if (node.end) reach = Math.max(reach, j + 1)
          }
          const bold = i < reach
          if (bold && !open) {
            out += '<b>'
            open = true
          }
          if (!bold && open) {
            out += '</b>'
            open = false
          }
          out += s[i]
        }
        if (open) out += '</b>'
        return out
      },
    },
  ],
}
