import type { Problem } from '@/lib/types'

export const designTicTacToe: Problem = {
  id: 'design-tic-tac-toe',
  title: 'Design Tic-Tac-Toe',
  group: 'Medium',
  pattern: 'Design',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/design-tic-tac-toe/',
  statement:
    'Design a `TicTacToe` class for an `n x n` board. `move(row, col, player)` returns the winning player, or `0` when nobody has won yet. Moves are always valid and the players alternate. Scanning the board is `O(n)` per move; counting each row, column and diagonal with `+1` for one player and `-1` for the other makes it `O(1)` — a line is won when its counter reaches `n` or `-n`.',
  constraints: [
    '2 <= n <= 100',
    'player is 1 or 2',
    '0 <= row, col < n',
    'Each (row, col) is played at most once, and at most n^2 moves are made',
  ],

  design: {
    className: 'TicTacToe',
    ctor: [{ name: 'n', type: 'int' }],
    methods: [
      {
        name: 'move',
        params: [
          { name: 'row', type: 'int' },
          { name: 'col', type: 'int' },
          { name: 'player', type: 'int' },
        ],
        ret: 'int',
      },
    ],
  },

  designTests: [
    {
      ops: ['TicTacToe', 'move', 'move', 'move', 'move', 'move', 'move', 'move'],
      args: [[3], [0, 0, 1], [0, 2, 2], [2, 2, 1], [1, 1, 2], [2, 0, 1], [1, 0, 2], [2, 1, 1]],
      expect: [null, 0, 0, 0, 0, 0, 0, 1],
    },
    // player 2 wins on the anti-diagonal
    {
      ops: ['TicTacToe', 'move', 'move', 'move', 'move', 'move'],
      args: [[3], [0, 0, 1], [0, 2, 2], [0, 1, 1], [1, 1, 2], [2, 0, 2]],
      expect: [null, 0, 0, 0, 0, 2],
    },
    // the smallest board: two in a column wins
    {
      ops: ['TicTacToe', 'move', 'move', 'move'],
      args: [[2], [0, 0, 1], [0, 1, 2], [1, 0, 1]],
      expect: [null, 0, 0, 1],
    },
    // a full 3x3 board with no winner
    {
      ops: ['TicTacToe', 'move', 'move', 'move', 'move', 'move', 'move', 'move', 'move', 'move'],
      args: [[3], [0, 0, 1], [0, 1, 2], [0, 2, 1], [1, 1, 2], [1, 0, 1], [1, 2, 2], [2, 1, 1], [2, 0, 2], [2, 2, 1]],
      expect: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    // a 4x4 board: three in a row is not enough
    {
      ops: ['TicTacToe', 'move', 'move', 'move', 'move', 'move', 'move', 'move'],
      args: [[4], [3, 0, 1], [0, 0, 2], [3, 1, 1], [1, 1, 2], [3, 2, 1], [2, 2, 2], [3, 3, 1]],
      expect: [null, 0, 0, 0, 0, 0, 0, 1],
    },
  ],

  starter: {
    js: `class TicTacToe {
  constructor(n) {
    // n: number — the board is n x n
  }

  move(row, col, player) {
    // row: number, col: number, player: 1 | 2  ->  the winner, or 0
  }
}
`,
    cpp: `class TicTacToe {
public:
    TicTacToe(int n) {
    }

    int move(int row, int col, int player) {
        // your code here
    }
};
`,
  },

  solutions: [
    {
      id: 'scan-lines',
      label: 'Place the mark, then scan its row, column and diagonals',
      kind: 'brute',
      time: 'O(n) per move',
      space: 'O(n^2)',
      blurb:
        'Keep the board itself. After each move, check whether the row just played, the column just played, and either diagonal it sits on are now entirely this player\'s marks. Correct and obvious, but every move rereads up to four full lines of the board.',
      code: {
        cpp: {
          lines: [
            'class TicTacToe {',
            '    int n;',
            '    vector<vector<int>> board;',
            '',
            'public:',
            '    TicTacToe(int n) : n(n), board(n, vector<int>(n, 0)) {}',
            '',
            '    int move(int row, int col, int player) {',
            '        board[row][col] = player;',
            '        bool rowWin = true, colWin = true, diagWin = row == col, antiWin = row + col == n - 1;',
            '        for (int k = 0; k < n; ++k) {',
            '            if (board[row][k] != player) rowWin = false;',
            '            if (board[k][col] != player) colWin = false;',
            '            if (board[k][k] != player) diagWin = false;',
            '            if (board[k][n - 1 - k] != player) antiWin = false;',
            '        }',
            '        return rowWin || colWin || diagWin || antiWin ? player : 0;',
            '    }',
            '};',
          ],
        },
        js: {
          lines: [
            'class TicTacToe {',
            '  constructor(n) {',
            '    this.n = n;',
            '    this.board = Array.from({ length: n }, () => new Array(n).fill(0));',
            '  }',
            '',
            '  move(row, col, player) {',
            '    const { n, board } = this;',
            '    board[row][col] = player;',
            '    let rowWin = true, colWin = true;',
            '    let diagWin = row === col;',
            '    let antiWin = row + col === n - 1;',
            '    for (let k = 0; k < n; k++) {',
            '      if (board[row][k] !== player) rowWin = false;',
            '      if (board[k][col] !== player) colWin = false;',
            '      if (board[k][k] !== player) diagWin = false;',
            '      if (board[k][n - 1 - k] !== player) antiWin = false;',
            '    }',
            '    return rowWin || colWin || diagWin || antiWin ? player : 0;',
            '  }',
            '}',
          ],
        },
      },

      run([ops, args]: [string[], number[][]], c) {
        const n = args[0][0]
        const board = Array.from({ length: n }, () => new Array<number>(n).fill(0))
        const out: (number | null)[] = [null]
        for (let i = 1; i < ops.length; i++) {
          if (ops[i] !== 'move') {
            out.push(null)
            continue
          }
          const [row, col, player] = args[i]
          board[row][col] = player
          let rowWin = true
          let colWin = true
          let diagWin = row === col
          let antiWin = row + col === n - 1
          for (let k = 0; k < n; k++) {
            c.ops++
            if (board[row][k] !== player) rowWin = false
            if (board[k][col] !== player) colWin = false
            if (board[k][k] !== player) diagWin = false
            if (board[k][n - 1 - k] !== player) antiWin = false
          }
          out.push(rowWin || colWin || diagWin || antiWin ? player : 0)
        }
        return out
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'signed-counters',
      label: 'One signed counter per row, column and diagonal',
      kind: 'optimal',
      time: 'O(1) per move',
      space: 'O(n)',
      blurb:
        'A line is won when it holds `n` marks of one player and none of the other, so it only needs a single number: add `+1` for player one and `-1` for player two. The board itself is never stored. A move updates its row, its column, and whichever diagonals it lies on; any counter hitting `n` or `-n` names the winner.',
      code: {
        cpp: {
          lines: [
            'class TicTacToe {',
            '    int n;',
            '    vector<int> rows, cols;',
            '    int diag = 0, anti = 0;',
            '',
            'public:',
            '    TicTacToe(int n) : n(n), rows(n, 0), cols(n, 0) {}',
            '',
            '    int move(int row, int col, int player) {',
            '        int sign = player == 1 ? 1 : -1;',
            '        rows[row] += sign;',
            '        cols[col] += sign;',
            '        if (row == col) diag += sign;',
            '        if (row + col == n - 1) anti += sign;',
            '        if (abs(rows[row]) == n || abs(cols[col]) == n || abs(diag) == n || abs(anti) == n) return player;',
            '        return 0;',
            '    }',
            '};',
          ],
        },
        js: {
          lines: [
            'class TicTacToe {',
            '  constructor(n) {',
            '    this.n = n;',
            '    this.rows = new Array(n).fill(0);',
            '    this.cols = new Array(n).fill(0);',
            '    this.diag = 0;',
            '    this.anti = 0;',
            '  }',
            '',
            '  move(row, col, player) {',
            '    const sign = player === 1 ? 1 : -1;',
            '    this.rows[row] += sign;',
            '    this.cols[col] += sign;',
            '    if (row === col) this.diag += sign;',
            '    if (row + col === this.n - 1) this.anti += sign;',
            '    const n = this.n;',
            '    if (',
            '      Math.abs(this.rows[row]) === n || Math.abs(this.cols[col]) === n ||',
            '      Math.abs(this.diag) === n || Math.abs(this.anti) === n',
            '    ) return player;',
            '    return 0;',
            '  }',
            '}',
          ],
        },
      },

      run([ops, args]: [string[], number[][]], c) {
        const n = args[0][0]
        const rows = new Array<number>(n).fill(0)
        const cols = new Array<number>(n).fill(0)
        let diag = 0
        let anti = 0
        const out: (number | null)[] = [null]
        for (let i = 1; i < ops.length; i++) {
          if (ops[i] !== 'move') {
            out.push(null)
            continue
          }
          c.ops++
          const [row, col, player] = args[i]
          const sign = player === 1 ? 1 : -1
          rows[row] += sign
          cols[col] += sign
          if (row === col) diag += sign
          if (row + col === n - 1) anti += sign
          const won =
            Math.abs(rows[row]) === n || Math.abs(cols[col]) === n || Math.abs(diag) === n || Math.abs(anti) === n
          out.push(won ? player : 0)
        }
        return out
      },
    },
  ],
}
