import type { Problem } from '@/lib/types'

export const designSnakeGame: Problem = {
  id: 'design-snake-game',
  title: 'Design Snake Game',
  group: 'Medium',
  pattern: 'Design',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/design-snake-game/',
  statement:
    'Design a `SnakeGame` on a `height x width` screen. The snake starts at `(0, 0)` with length 1, and `move(direction)` returns the score afterwards, or `-1` when the snake leaves the screen or runs into itself. Food is eaten in the order given, each bite growing the snake by one. A deque holds the body and a set of occupied cells makes the self-collision check `O(1)` — remembering to free the tail cell before testing the new head.',
  constraints: [
    '1 <= width, height <= 10^4',
    '1 <= food.length <= 50',
    "direction is 'U', 'D', 'L', or 'R'",
    'At most 10^4 calls are made to move',
  ],
}
