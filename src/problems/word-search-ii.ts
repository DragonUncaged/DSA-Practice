import { combo, grid, mapOf, type Problem, type Tone } from '@/lib/types'

const DEMO: [string[][], string[]] = [
  [
    ['o', 'a', 'a', 'n'],
    ['e', 't', 'a', 'e'],
    ['i', 'h', 'k', 'r'],
    ['i', 'f', 'l', 'v'],
  ],
  ['oath', 'pea', 'eat', 'rain'],
]

export const wordSearchII: Problem = {
  id: 'word-search-ii',
  title: 'Word Search II',
  group: 'Tree',
  pattern: 'Trie + Grid DFS',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/word-search-ii/',
  statement:
    'Given a letter grid and a list of `words`, return every word that can be traced through adjacent cells (each cell used once per word).',
  constraints: ['1 <= m, n <= 12', '1 <= words.length <= 3 * 10^4', 'Answers in any order'],
  signature: {
    fn: 'findWords',
    params: [
      { name: 'board', type: 'char[][]' },
      { name: 'words', type: 'string[]' },
    ],
    ret: 'string[]',
  },
  compare: 'set',
  tests: [
    {
      args: [
        [['o', 'a', 'a', 'n'], ['e', 't', 'a', 'e'], ['i', 'h', 'k', 'r'], ['i', 'f', 'l', 'v']],
        ['oath', 'pea', 'eat', 'rain'],
      ],
      expect: ['eat', 'oath'],
    },
    { args: [[['a', 'b'], ['c', 'd']], ['abcb']], expect: [] },
    { args: [[['a']], ['a', 'b']], expect: ['a'] },
  ],
  demo: DEMO,
  starter: {
    py: `def findWords(board, words):
    # board: list[list[str]], words: list[str]  ->  list[str]
    pass
`,
    js: `function findWords(board, words) {
  // board: string[][], words: string[]  ->  string[]
}
`,
    cpp: `vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'trie-dfs',
      label: 'All words at once, guided by a trie',
      kind: 'optimal',
      time: 'O(m * n * 4^maxLen)',
      space: 'O(total characters)',
      blurb:
        'Searching each word separately re-walks the same grid paths over and over. Load every word into a trie instead, then DFS the grid once: a step is only taken if the trie has a matching child, so one walk advances all words that share the prefix — and dies instantly on prefixes no word has.',
      code: {
        py: {
          lines: [
            'def findWords(board, words):',
            '    root = {}',
            '    for w in words:',
            '        node = root',
            '        for ch in w:',
            '            node = node.setdefault(ch, {})',
            "        node['$'] = w",
            '    m, n = len(board), len(board[0])',
            '    out = []',
            '    def dfs(i, j, node):',
            '        if i < 0 or i >= m or j < 0 or j >= n:',
            '            return',
            '        ch = board[i][j]',
            '        if ch not in node:',
            '            return',
            '        nxt = node[ch]',
            "        if '$' in nxt:",
            "            out.append(nxt.pop('$'))",
            "        board[i][j] = '#'",
            '        dfs(i+1, j, nxt); dfs(i-1, j, nxt)',
            '        dfs(i, j+1, nxt); dfs(i, j-1, nxt)',
            '        board[i][j] = ch',
            '    for i in range(m):',
            '        for j in range(n):',
            '            dfs(i, j, root)',
            '    return out',
          ],
          map: { build: 7, walk: 16, found: 18, dead: 15, done: 26 },
        },
        cpp: {
          lines: [
            'vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {',
            '    struct Node { map<char, Node*> ch; string word; };',
            '    Node* root = new Node();',
            '    for (auto& w : words) {',
            '        Node* node = root;',
            '        for (char c : w) {',
            '            if (!node->ch.count(c)) node->ch[c] = new Node();',
            '            node = node->ch[c];',
            '        }',
            '        node->word = w;',
            '    }',
            '    int m = board.size(), n = board[0].size();',
            '    vector<string> out;',
            '    function<void(int, int, Node*)> dfs = [&](int i, int j, Node* node) {',
            '        if (i < 0 || i >= m || j < 0 || j >= n) return;',
            '        char c = board[i][j];',
            '        if (!node->ch.count(c)) return;',
            '        Node* nxt = node->ch[c];',
            '        if (!nxt->word.empty()) { out.push_back(nxt->word); nxt->word.clear(); }',
            "        board[i][j] = '#';",
            '        dfs(i+1, j, nxt); dfs(i-1, j, nxt); dfs(i, j+1, nxt); dfs(i, j-1, nxt);',
            '        board[i][j] = c;',
            '    };',
            '    for (int i = 0; i < m; ++i)',
            '        for (int j = 0; j < n; ++j)',
            '            dfs(i, j, root);',
            '    return out;',
            '}',
          ],
          map: { build: 10, walk: 18, found: 19, dead: 17, done: 27 },
        },
        js: {
          lines: [
            'function findWords(board, words) {',
            '  const root = {};',
            '  for (const w of words) {',
            '    let node = root;',
            '    for (const ch of w) node = node[ch] ?? (node[ch] = {});',
            '    node.$word = w;',
            '  }',
            '  const m = board.length;',
            '  const n = board[0].length;',
            '  const out = [];',
            '  const dfs = (i, j, node) => {',
            '    if (i < 0 || i >= m || j < 0 || j >= n) return;',
            '    const ch = board[i][j];',
            '    const nxt = node[ch];',
            '    if (!nxt) return;',
            '    if (nxt.$word) {',
            '      out.push(nxt.$word);',
            '      delete nxt.$word;',
            '    }',
            "    board[i][j] = '#';",
            '    dfs(i + 1, j, nxt); dfs(i - 1, j, nxt);',
            '    dfs(i, j + 1, nxt); dfs(i, j - 1, nxt);',
            '    board[i][j] = ch;',
            '  };',
            '  for (let i = 0; i < m; i++)',
            '    for (let j = 0; j < n; j++)',
            '      dfs(i, j, root);',
            '  return out;',
            '}',
          ],
          map: { build: 6, walk: 14, found: 17, dead: 15, done: 28 },
        },
      },

      trace(t, [input, words]: [string[][], string[]]) {
        type TNode = { children: Map<string, TNode>; word: string | null }
        const root: TNode = { children: new Map(), word: null }
        for (const w of words) {
          let node = root
          for (const ch of w) {
            if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), word: null })
            node = node.children.get(ch)!
          }
          node.word = w
        }

        const board = input.map((r) => [...r])
        const m = board.length
        const n = board[0].length
        const out: string[] = []
        const path: [number, number][] = []

        const view = (tone: Tone) => {
          const tones: Record<string, Tone> = {}
          for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) tones[`${i},${j}`] = 'idle'
          path.forEach(([i, j], k) => {
            tones[`${i},${j}`] = k === path.length - 1 ? tone : 'good'
          })
          return combo(
            grid(input, { tones, title: 'board' }),
            mapOf(
              words.map((w) => ({
                k: w,
                tone: out.includes(w) ? ('good' as Tone) : ('band' as Tone),
              })),
              { title: 'words — green when found', asSet: true },
            ),
          )
        }

        t.push({
          step: 'build',
          note: `All ${words.length} words go into one trie. The grid is then walked once; steps that no word could continue are never taken.`,
          view: view('idle'),
          vars: [['words', words.length]],
        })

        const dfs = (i: number, j: number, node: TNode) => {
          if (t.full) return
          if (i < 0 || i >= m || j < 0 || j >= n) return
          const ch = board[i][j]
          const nxt = node.children.get(ch)
          t.bump()
          if (!nxt) return

          path.push([i, j])
          if (nxt.word) {
            out.push(nxt.word)
            t.push({
              step: 'found',
              note: `The path just completed "${nxt.word}" — recorded and removed from the trie so it cannot be reported twice.`,
              view: view('active'),
              vars: [
                ['found', `"${nxt.word}"`, 'ok'],
                ['total', out.length, 'ok'],
              ],
              badge: { text: `"${nxt.word}" found`, accent: 'ok' },
            })
            nxt.word = null
          }

          board[i][j] = '#'
          dfs(i + 1, j, nxt)
          dfs(i - 1, j, nxt)
          dfs(i, j + 1, nxt)
          dfs(i, j - 1, nxt)
          board[i][j] = ch
          path.pop()
        }

        for (let i = 0; i < m && !t.full; i++) {
          for (let j = 0; j < n && !t.full; j++) {
            if (root.children.has(board[i][j])) {
              t.push({
                step: 'walk',
                note: `(${i}, ${j}) = '${board[i][j]}' starts at least one word — worth a DFS. Cells starting no word are skipped outright.`,
                view: view('active'),
                vars: [['trailhead', `(${i}, ${j}) '${board[i][j]}'`, 'c']],
              })
              dfs(i, j, root)
            }
          }
        }

        t.push({
          step: 'done',
          note: `${out.length} word${out.length === 1 ? '' : 's'} found: ${out.map((w) => `"${w}"`).join(', ') || 'none'}. One grid walk served all ${words.length} words simultaneously.`,
          view: view('idle'),
          vars: [['answer', JSON.stringify(out), 'ok']],
          badge: { text: `${out.length} found`, accent: 'ok' },
        })
      },

      run([input, words]: [string[][], string[]], c) {
        type TNode = { children: Map<string, TNode>; word: string | null }
        const root: TNode = { children: new Map(), word: null }
        for (const w of words) {
          let node = root
          for (const ch of w) {
            c.ops++
            if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), word: null })
            node = node.children.get(ch)!
          }
          node.word = w
        }
        const board = input.map((r) => [...r])
        const m = board.length
        const n = board[0].length
        const out: string[] = []
        const dfs = (i: number, j: number, node: TNode) => {
          if (i < 0 || i >= m || j < 0 || j >= n) return
          const nxt = node.children.get(board[i][j])
          c.ops++
          if (!nxt) return
          if (nxt.word) {
            out.push(nxt.word)
            nxt.word = null
          }
          const ch = board[i][j]
          board[i][j] = '#'
          dfs(i + 1, j, nxt)
          dfs(i - 1, j, nxt)
          dfs(i, j + 1, nxt)
          dfs(i, j - 1, nxt)
          board[i][j] = ch
        }
        for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) dfs(i, j, root)
        return out
      },
    },
  ],
}
