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
}
