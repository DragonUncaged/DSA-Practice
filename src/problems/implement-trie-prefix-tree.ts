import { combo, mapOf, text, type Problem, type Tone } from '@/lib/types'

const DEMO: [string[], string[]] = [
  ['apple', 'app'],
  ['search apple', 'search app', 'prefix app', 'search apples', 'prefix apples'],
]

export const implementTrie: Problem = {
  id: 'implement-trie-prefix-tree',
  title: 'Implement Trie (Prefix Tree)',
  group: 'Tree',
  pattern: 'Trie',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
  statement:
    'Build a trie supporting insert, exact search, and prefix search. The runner calls `trieQueries(words, queries)`: insert every word, then answer each query — `"search w"` asks for an exact match, `"prefix p"` asks whether any word starts with p. Return 1/0 per query.',
  constraints: ['1 <= words, queries <= 10^4', 'Lowercase English letters'],
  signature: {
    fn: 'trieQueries',
    params: [
      { name: 'words', type: 'string[]' },
      { name: 'queries', type: 'string[]' },
    ],
    ret: 'int[]',
  },
  tests: [
    {
      args: [['apple'], ['search apple', 'search app', 'prefix app', 'search apples']],
      expect: [1, 0, 1, 0],
    },
    { args: [['a'], ['search a', 'prefix a']], expect: [1, 1] },
    { args: [['ab', 'abc'], ['search ab', 'prefix abc', 'prefix abcd']], expect: [1, 1, 0] },
  ],
  demo: DEMO,
  scale: (n) => [
    Array.from({ length: n }, (_, i) => 'w' + i.toString(36)),
    Array.from({ length: n }, (_, i) => `search w${i.toString(36)}`),
  ],
  starter: {
    py: `def trieQueries(words, queries):
    # build a Trie class with insert/search/startsWith,
    # insert all words, answer each query with 1 or 0
    pass
`,
    js: `function trieQueries(words, queries) {
  // build a Trie class with insert/search/startsWith,
  // insert all words, answer each query with 1 or 0
}
`,
    cpp: `vector<int> trieQueries(vector<string>& words, vector<string>& queries) {
    // build a Trie, insert all words, answer each query with 1 or 0
}
`,
  },

  solutions: [
    {
      id: 'trie',
      label: 'One node per shared prefix',
      kind: 'optimal',
      time: 'O(length) per operation',
      space: 'O(total characters)',
      blurb:
        'Words that share a prefix share a path: each node holds up to 26 children and an "a word ends here" flag. Insert, search and prefix-check are all the same walk — follow one child per character, and the only difference is what you check at the end.',
      code: {
        py: {
          lines: [
            'def trieQueries(words, queries):',
            '    root = {}',
            '    END = object()',
            '    for w in words:',
            '        node = root',
            '        for ch in w:',
            '            node = node.setdefault(ch, {})',
            '        node[END] = True',
            '    def walk(s):',
            '        node = root',
            '        for ch in s:',
            '            if ch not in node:',
            '                return None',
            '            node = node[ch]',
            '        return node',
            '    out = []',
            '    for query in queries:',
            '        kind, _, arg = query.partition(" ")',
            '        node = walk(arg)',
            '        if kind == "search":',
            '            out.append(1 if node is not None and END in node else 0)',
            '        else:',
            '            out.append(1 if node is not None else 0)',
            '    return out',
          ],
          map: { insert: 8, walk: 14, hit: 21, miss: 13, done: 24 },
        },
        cpp: {
          lines: [
            'vector<int> trieQueries(vector<string>& words, vector<string>& queries) {',
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
            '    auto walk = [&](const string& s) -> Node* {',
            '        Node* node = root;',
            '        for (char c : s) {',
            '            if (!node->ch.count(c)) return nullptr;',
            '            node = node->ch[c];',
            '        }',
            '        return node;',
            '    };',
            '    vector<int> out;',
            '    for (auto& q : queries) {',
            '        auto sp = q.find(\' \');',
            '        string kind = q.substr(0, sp), arg = q.substr(sp + 1);',
            '        Node* node = walk(arg);',
            '        if (kind == "search") out.push_back(node && node->end ? 1 : 0);',
            '        else out.push_back(node ? 1 : 0);',
            '    }',
            '    return out;',
            '}',
          ],
          map: { insert: 10, walk: 18, hit: 25, miss: 15, done: 28 },
        },
        js: {
          lines: [
            'function trieQueries(words, queries) {',
            '  const root = {};',
            '  for (const w of words) {',
            '    let node = root;',
            '    for (const ch of w) {',
            '      node = node[ch] ?? (node[ch] = {});',
            '    }',
            '    node.$end = true;',
            '  }',
            '  const walk = (s) => {',
            '    let node = root;',
            '    for (const ch of s) {',
            '      if (!node[ch]) return null;',
            '      node = node[ch];',
            '    }',
            '    return node;',
            '  };',
            '  return queries.map((q) => {',
            "    const [kind, arg] = q.split(' ');",
            '    const node = walk(arg);',
            "    if (kind === 'search') return node && node.$end ? 1 : 0;",
            '    return node ? 1 : 0;',
            '  });',
            '}',
          ],
          map: { insert: 8, walk: 15, hit: 21, miss: 13, done: 22 },
        },
      },

      trace(t, [words, queries]: [string[], string[]]) {
        interface TNode {
          children: Map<string, TNode>
          end: boolean
        }
        const root: TNode = { children: new Map(), end: false }
        const inserted: string[] = []

        const trieRows = (): { k: string; v?: string; tone?: Tone }[] => {
          const rows: { k: string; v?: string; tone?: Tone }[] = []
          const dfs = (node: TNode, prefix: string) => {
            if (node.end) rows.push({ k: prefix, v: '●', tone: 'good' })
            for (const [ch, child] of node.children) dfs(child, prefix + ch)
          }
          dfs(root, '')
          return rows.length ? rows : [{ k: '(empty)' }]
        }

        const view = (query: string | null) =>
          combo(
            mapOf(trieRows(), { title: 'paths in the trie — ● marks a complete word' }),
            ...(query != null ? [text(query, { title: 'current walk', showIndex: false })] : []),
          )

        t.push({
          step: 'insert',
          note: `Insert ${words.map((w) => `"${w}"`).join(', ')}. Shared prefixes share nodes — "app" costs nothing extra once "apple" is in.`,
          view: view(null),
          vars: [['words', words.length]],
        })

        for (const w of words) {
          let node = root
          for (const ch of w) {
            if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), end: false })
            node = node.children.get(ch)!
            t.bump()
          }
          node.end = true
          inserted.push(w)
          t.push({
            step: 'insert',
            note: `"${w}" inserted: one node per character along its path, and the final node flagged as a word end.`,
            view: view(null),
            vars: [['inserted', `"${w}"`, 'ok']],
            badge: { text: `+ "${w}"`, accent: 'ok' },
          })
        }

        const out: number[] = []
        for (const q of queries) {
          if (t.full) break
          const [kind, arg] = q.split(' ')
          let node: TNode | null = root
          for (const ch of arg) {
            t.bump()
            node = node.children.get(ch) ?? null
            if (node == null) break
          }

          const ok = kind === 'search' ? node != null && node.end : node != null
          out.push(ok ? 1 : 0)

          if (node == null) {
            t.push({
              step: 'miss',
              note: `${kind === 'search' ? 'Search' : 'Prefix check'} "${arg}": the walk fell off the trie — some character had no child. ${kind === 'search' ? 'Not a word' : 'No word starts with it'}.`,
              view: view(arg),
              vars: [
                ['query', q, 'no'],
                ['result', 0, 'no'],
              ],
              badge: { text: `${q} → 0`, accent: 'no' },
            })
          } else {
            t.push({
              step: 'hit',
              note:
                kind === 'search'
                  ? node.end
                    ? `Search "${arg}": the walk completed AND the final node carries the word-end flag — a real inserted word. 1.`
                    : `Search "${arg}": the walk completed, but no word ends here — "${arg}" is only a prefix of something longer. 0.`
                  : `Prefix "${arg}": the walk completed, so at least one inserted word passes through this path. 1.`,
              view: view(arg),
              vars: [
                ['query', q, 'c'],
                ['result', ok ? 1 : 0, ok ? 'ok' : 'no'],
              ],
              badge: { text: `${q} → ${ok ? 1 : 0}`, accent: ok ? 'ok' : 'no' },
            })
          }
        }

        t.push({
          step: 'done',
          note: `All queries answered: [${out.join(', ')}]. Every operation cost exactly the length of its argument — independent of how many words the trie holds.`,
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
        const out: number[] = []
        for (const q of queries) {
          const [kind, arg] = q.split(' ')
          let node: TNode | null = root
          for (const ch of arg) {
            c.ops++
            node = node.children.get(ch) ?? null
            if (node == null) break
          }
          out.push(kind === 'search' ? (node != null && node.end ? 1 : 0) : node != null ? 1 : 0)
        }
        return out
      },
    },
  ],
}
