import { combo, mapOf, text, type Problem, type Tone } from '@/lib/types'

const DEMO: [string[], string[]] = [
  ['bad', 'dad', 'mad'],
  ['pad', 'bad', '.ad', 'b..'],
]

export const addAndSearchWord: Problem = {
  id: 'add-and-search-word',
  title: 'Add and Search Word',
  group: 'Tree',
  pattern: 'Trie + Wildcard DFS',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/',
  statement:
    'Design a word dictionary where searches may contain `.` as a wildcard matching any single letter. The runner calls `addAndSearch(words, queries)`: add every word, then answer each query with 1/0.',
  constraints: ['1 <= words, queries <= 10^4', 'Queries may contain "." wildcards'],
  signature: {
    fn: 'addAndSearch',
    params: [
      { name: 'words', type: 'string[]' },
      { name: 'queries', type: 'string[]' },
    ],
    ret: 'int[]',
  },
  tests: [
    { args: [['bad', 'dad', 'mad'], ['pad', 'bad', '.ad', 'b..']], expect: [0, 1, 1, 1] },
    { args: [['a'], ['.', 'a', 'aa']], expect: [1, 1, 0] },
    { args: [['abc'], ['a.c', '.b.', '...', 'a..d']], expect: [1, 1, 1, 0] },
  ],
  demo: DEMO,
  scale: (n) => [
    Array.from({ length: n }, (_, i) => 'w' + i.toString(36)),
    Array.from({ length: n }, (_, i) => 'w' + i.toString(36)),
  ],
  starter: {
    py: `def addAndSearch(words, queries):
    # trie with '.' wildcard search; return 1/0 per query
    pass
`,
    js: `function addAndSearch(words, queries) {
  // trie with '.' wildcard search; return 1/0 per query
}
`,
    cpp: `vector<int> addAndSearch(vector<string>& words, vector<string>& queries) {
    // trie with '.' wildcard search; return 1/0 per query
}
`,
  },

  solutions: [
    {
      id: 'wildcard-trie',
      label: 'Trie walk that forks on dots',
      kind: 'optimal',
      time: 'O(26^d * length) worst case',
      space: 'O(total characters)',
      blurb:
        'A plain letter follows one child, exactly like an ordinary trie search. A "." cannot choose — so it tries every child, forking the walk into a small DFS. With few dots the search stays near-linear; each dot multiplies the branching.',
      code: {
        py: {
          lines: [
            'def addAndSearch(words, queries):',
            '    root = {}',
            '    for w in words:',
            '        node = root',
            '        for ch in w:',
            '            node = node.setdefault(ch, {})',
            "        node['$'] = True",
            '    def find(node, s, i):',
            '        if i == len(s):',
            "            return '$' in node",
            '        ch = s[i]',
            "        if ch == '.':",
            '            return any(find(child, s, i + 1)',
            "                       for k, child in node.items() if k != '$')",
            '        return ch in node and find(node[ch], s, i + 1)',
            '    return [1 if find(root, q, 0) else 0 for q in queries]',
          ],
          map: { insert: 7, step: 15, fork: 13, end: 10, done: 16 },
        },
        cpp: {
          lines: [
            'vector<int> addAndSearch(vector<string>& words, vector<string>& queries) {',
            '    struct Node { map<char, Node*> ch; bool end = false; };',
            '    Node* root = new Node();',
            '    for (auto& w : words) {',
            '        Node* node = root;',
            '        for (char c : w) {',
            '            if (!node->ch.count(c)) node->ch[c] = new Node();',
            '            node = node->ch[c];',
            '        }',
            '        node->end = true;',
            '    }',
            '    function<bool(Node*, const string&, int)> find = [&](Node* node, const string& s, int i) {',
            '        if (i == (int)s.size()) return node->end;',
            "        if (s[i] == '.') {",
            '            for (auto& [k, child] : node->ch)',
            '                if (find(child, s, i + 1)) return true;',
            '            return false;',
            '        }',
            '        return node->ch.count(s[i]) && find(node->ch[s[i]], s, i + 1);',
            '    };',
            '    vector<int> out;',
            '    for (auto& q : queries) out.push_back(find(root, q, 0) ? 1 : 0);',
            '    return out;',
            '}',
          ],
          map: { insert: 10, step: 19, fork: 16, end: 13, done: 23 },
        },
        js: {
          lines: [
            'function addAndSearch(words, queries) {',
            '  const root = {};',
            '  for (const w of words) {',
            '    let node = root;',
            '    for (const ch of w) node = node[ch] ?? (node[ch] = {});',
            '    node.$end = true;',
            '  }',
            '  const find = (node, s, i) => {',
            '    if (i === s.length) return !!node.$end;',
            '    const ch = s[i];',
            "    if (ch === '.') {",
            '      return Object.keys(node).some(',
            "        (k) => k !== '$end' && find(node[k], s, i + 1),",
            '      );',
            '    }',
            '    return !!node[ch] && find(node[ch], s, i + 1);',
            '  };',
            '  return queries.map((q) => (find(root, q, 0) ? 1 : 0));',
            '}',
          ],
          map: { insert: 6, step: 16, fork: 13, end: 9, done: 18 },
        },
      },

      trace(t, [words, queries]: [string[], string[]]) {
        interface TNode {
          children: Map<string, TNode>
          end: boolean
        }
        const root: TNode = { children: new Map(), end: false }
        for (const w of words) {
          let node = root
          for (const ch of w) {
            if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), end: false })
            node = node.children.get(ch)!
          }
          node.end = true
        }

        const trieRows = (): { k: string; v?: string; tone?: Tone }[] => {
          const rows: { k: string; v?: string; tone?: Tone }[] = []
          const dfs = (node: TNode, prefix: string) => {
            if (node.end) rows.push({ k: prefix, v: '●', tone: 'band' })
            for (const [ch, child] of node.children) dfs(child, prefix + ch)
          }
          dfs(root, '')
          return rows
        }

        const view = (q: string | null) =>
          combo(
            mapOf(trieRows(), { title: 'words in the trie' }),
            ...(q != null ? [text(q, { title: 'query', showIndex: false })] : []),
          )

        t.push({
          step: 'insert',
          note: `Dictionary loaded: ${words.map((w) => `"${w}"`).join(', ')}. Now each query walks the trie — dots fork the walk into every child.`,
          view: view(null),
          vars: [['words', words.length]],
        })

        const out: number[] = []
        for (const q of queries) {
          if (t.full) break
          let forks = 0

          const find = (node: TNode, i: number): boolean => {
            if (t.full) return false
            t.bump()
            if (i === q.length) return node.end
            const ch = q[i]
            if (ch === '.') {
              forks += Math.max(0, node.children.size - 1)
              for (const child of node.children.values()) {
                if (find(child, i + 1)) return true
              }
              return false
            }
            const child = node.children.get(ch)
            return child != null && find(child, i + 1)
          }

          const ok = find(root, 0)
          out.push(ok ? 1 : 0)

          const hasDot = q.includes('.')
          t.push({
            step: hasDot ? 'fork' : 'step',
            note: hasDot
              ? `"${q}": each '.' tried every child at its position — ${forks} extra branch${forks === 1 ? '' : 'es'} explored. ${ok ? 'One branch reached a word end: 1.' : 'No branch survived: 0.'}`
              : `"${q}": plain letters, single path down the trie. ${ok ? 'Ends on a word: 1.' : 'Falls off or ends mid-path: 0.'}`,
            view: view(q),
            vars: [
              ['query', `"${q}"`, 'c'],
              ['branches', 1 + forks],
              ['result', ok ? 1 : 0, ok ? 'ok' : 'no'],
            ],
            badge: { text: `"${q}" → ${ok ? 1 : 0}`, accent: ok ? 'ok' : 'no' },
          })
        }

        t.push({
          step: 'done',
          note: `Answers: [${out.join(', ')}]. Exact queries stay O(length); every dot multiplies the branching by the children at that depth.`,
          view: view(null),
          vars: [['answer', `[${out.join(', ')}]`, 'ok']],
          badge: { text: 'complete', accent: 'ok' },
        })
      },

      run([words, queries]: [string[], string[]], c) {
        interface TNode {
          children: Map<string, TNode>
          end: boolean
        }
        const root: TNode = { children: new Map(), end: false }
        for (const w of words) {
          let node = root
          for (const ch of w) {
            c.ops++
            if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), end: false })
            node = node.children.get(ch)!
          }
          node.end = true
        }
        const find = (node: TNode, s: string, i: number): boolean => {
          c.ops++
          if (i === s.length) return node.end
          if (s[i] === '.') {
            for (const child of node.children.values()) if (find(child, s, i + 1)) return true
            return false
          }
          const child = node.children.get(s[i])
          return child != null && find(child, s, i + 1)
        }
        return queries.map((q) => (find(root, q, 0) ? 1 : 0))
      },
    },
  ],
}
