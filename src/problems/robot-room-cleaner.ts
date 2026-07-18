import type { Problem } from '@/lib/types'

export const robotRoomCleaner: Problem = {
  id: 'robot-room-cleaner',
  title: 'Robot Room Cleaner',
  group: 'Hard',
  pattern: 'Design',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/robot-room-cleaner/',
  statement:
    'A robot sits somewhere in an unknown room and you may only call `move()`, `turnLeft()`, `turnRight()` and `clean()` — the grid itself is hidden. Clean every reachable cell. The way in is to keep your own coordinates relative to the start, spiral through the four headings at each cell, and after each branch back up by turning around, moving once, and turning around again so the robot is exactly where it started.',
  constraints: [
    '1 <= m <= 100 and 1 <= n <= 200',
    'room[i][j] is 0 (wall) or 1 (open)',
    'The robot starts on an open cell facing up',
    'Every open cell is reachable from the start',
  ],
}
