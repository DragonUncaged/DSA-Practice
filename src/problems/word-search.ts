import { grid, type Problem, type Tone } from '@/lib/types'

const DEMO: [string[][], string] = [
  [
    ['A', 'B', 'C', 'E'],
    ['S', 'F', 'C', 'S'],
    ['A', 'D', 'E', 'E'],
  ],
  'ABCCED',
]

export const wordSearch: Problem = {
  id: 'word-search',
  title: 'Word Search',
  group: 'Matrix',
  pattern: 'DFS Backtracking',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/word-search/',
  statement:
    'Given a grid of letters and a `word`, return `true` if the word can be traced through horizontally or vertically adjacent cells, using each cell at most once.',
  constraints: ['1 <= m, n <= 6', '1 <= word.length <= 15', 'A cell may be used once per path'],
  signature: {
    fn: 'exist',
    params: [
      { name: 'board', type: 'char[][]' },
      { name: 'word', type: 'string' },
    ],
    ret: 'bool',
  },
  tests: [
    { args: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'ABCCED'], expect: true },
    { args: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'SEE'], expect: true },
    { args: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'ABCB'], expect: false, note: 'would need to reuse a cell' },
    { args: [[['A']], 'A'], expect: true },
  ],
  demo: DEMO,
  starter: {
    js: `function exist(board, word) {
  // board: string[][], word: string  ->  boolean
}
`,
    cpp: `bool exist(vector<vector<char>>& board, string word) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'dfs',
      label: 'Walk, mark, backtrack',
      kind: 'optimal',
      time: 'O(m * n * 4^L)',
      space: 'O(L)',
      blurb:
        'From every cell that matches the first letter, walk depth-first matching one letter per step. Mark a cell while it is on the current path so it cannot be reused, and unmark it when backing out — the same cell may serve a different path later.',
      code: {
        cpp: {
          lines: [
            'bool exist(vector<vector<char>>& board, string word) {',
            '    int m = board.size(), n = board[0].size();',
            '    function<bool(int, int, int)> dfs = [&](int i, int j, int k) {',
            '        if (k == word.size()) return true;',
            '        if (i < 0 || i >= m || j < 0 || j >= n) return false;',
            '        if (board[i][j] != word[k]) return false;',
            "        char c = board[i][j]; board[i][j] = '#';",
            '        bool found = dfs(i+1, j, k+1) || dfs(i-1, j, k+1) ||',
            '                     dfs(i, j+1, k+1) || dfs(i, j-1, k+1);',
            '        board[i][j] = c;',
            '        return found;',
            '    };',
            '    for (int i = 0; i < m; ++i)',
            '        for (int j = 0; j < n; ++j)',
            '            if (dfs(i, j, 0)) return true;',
            '    return false;',
            '}',
          ],
          map: { start: 15, match: 7, found: 4, dead: 6, back: 10, done: 16 },
        },
        js: {
          lines: [
            'function exist(board, word) {',
            '  const m = board.length;',
            '  const n = board[0].length;',
            '  const dfs = (i, j, k) => {',
            '    if (k === word.length) return true;',
            '    if (i < 0 || i >= m || j < 0 || j >= n) return false;',
            '    if (board[i][j] !== word[k]) return false;',
            '    const c = board[i][j];',
            "    board[i][j] = '#';",
            '    const found =',
            '      dfs(i + 1, j, k + 1) || dfs(i - 1, j, k + 1) ||',
            '      dfs(i, j + 1, k + 1) || dfs(i, j - 1, k + 1);',
            '    board[i][j] = c;',
            '    return found;',
            '  };',
            '  for (let i = 0; i < m; i++)',
            '    for (let j = 0; j < n; j++)',
            '      if (dfs(i, j, 0)) return true;',
            '  return false;',
            '}',
          ],
          map: { start: 17, match: 9, found: 5, dead: 7, back: 13, done: 19 },
        },
      },

      trace(t, [input, word]: [string[][], string]) {
        const board = input.map((row) => [...row])
        const m = board.length
        const n = board[0].length
        const path: [number, number][] = []

        const paint = (focus: [number, number] | null, tone: Tone) => {
          const tones: Record<string, Tone> = {}
          for (let i = 0; i < m; i++)
            for (let j = 0; j < n; j++) tones[`${i},${j}`] = 'idle'
          path.forEach(([i, j], k) => {
            tones[`${i},${j}`] = k === path.length - 1 ? 'active' : 'good'
          })
          if (focus) tones[`${focus[0]},${focus[1]}`] = tone
          return grid(input, {
            tones,
            cursor: focus,
            title: `board · matched "${word.slice(0, path.length)}" of "${word}"`,
          })
        }

        const dfs = (i: number, j: number, k: number): boolean => {
          if (t.full) return false
          if (k === word.length) return true
          if (i < 0 || i >= m || j < 0 || j >= n) return false
          if (board[i][j] !== word[k]) {
            if (board[i][j] !== '#') {
              t.bump()
            }
            return false
          }

          t.bump()
          path.push([i, j])
          const complete = k + 1 === word.length
          t.push({
            step: 'match',
            note: `'${word[k]}' matches at (${i}, ${j}) — letter ${k + 1} of ${word.length}. The cell is marked while on the path so the word cannot double back onto it.`,
            view: paint(null, 'active'),
            vars: [
              ['matched', `"${word.slice(0, k + 1)}"`, 'ok'],
              ['at', `(${i}, ${j})`, 'b'],
            ],
            badge: { text: `"${word.slice(0, k + 1)}"`, accent: 'ok' },
          })

          if (complete) {
            t.push({
              step: 'found',
              note: `That was the last letter — "${word}" is fully traced. True.`,
              view: paint(null, 'good'),
              vars: [['answer', 'true', 'ok']],
              badge: { text: 'word found', accent: 'ok' },
            })
            return true
          }

          const c = board[i][j]
          board[i][j] = '#'
          const found = dfs(i + 1, j, k + 1) || dfs(i - 1, j, k + 1) || dfs(i, j + 1, k + 1) || dfs(i, j - 1, k + 1)
          board[i][j] = c

          if (!found && !t.full) {
            path.pop()
            t.push({
              step: 'back',
              note: `All four directions from (${i}, ${j}) dead-ended. Unmark the cell and back out — it stays available for other paths.`,
              view: paint([i, j], 'bad'),
              vars: [
                ['backtrack from', `(${i}, ${j})`, 'no'],
                ['matched', `"${word.slice(0, k)}"`],
              ],
              badge: { text: 'backtrack', accent: 'no' },
            })
          } else if (found) {
            // keep path for the final frames
          }
          return found
        }

        t.push({
          step: 'start',
          note: `Hunting for "${word}". Every cell matching '${word[0]}' is a possible trailhead.`,
          view: paint(null, 'idle'),
          vars: [['word', word]],
        })

        for (let i = 0; i < m && !t.full; i++) {
          for (let j = 0; j < n && !t.full; j++) {
            if (board[i][j] === word[0]) {
              t.push({
                step: 'start',
                note: `Trailhead at (${i}, ${j}).`,
                view: paint([i, j], 'active'),
                vars: [['try', `(${i}, ${j})`, 'c']],
              })
              if (dfs(i, j, 0)) return
            }
          }
        }

        t.push({
          step: 'done',
          note: `Every trailhead exhausted — "${word}" cannot be traced. False.`,
          view: paint(null, 'idle'),
          vars: [['answer', 'false', 'no']],
          badge: { text: 'false', accent: 'no' },
        })
      },

      run([input, word]: [string[][], string], c) {
        const board = input.map((row) => [...row])
        const m = board.length
        const n = board[0].length
        const dfs = (i: number, j: number, k: number): boolean => {
          if (k === word.length) return true
          if (i < 0 || i >= m || j < 0 || j >= n) return false
          c.ops++
          if (board[i][j] !== word[k]) return false
          const ch = board[i][j]
          board[i][j] = '#'
          const found = dfs(i + 1, j, k + 1) || dfs(i - 1, j, k + 1) || dfs(i, j + 1, k + 1) || dfs(i, j - 1, k + 1)
          board[i][j] = ch
          return found
        }
        for (let i = 0; i < m; i++)
          for (let j = 0; j < n; j++) if (dfs(i, j, 0)) return true
        return false
      },
    },
  ],
}
